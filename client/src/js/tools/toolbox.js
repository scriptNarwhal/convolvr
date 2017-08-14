/* toolbox */
import {send} from '../network/socket'
import ComponentTool from './component-tool'
import EntityTool from './entity-tool'
import DeleteTool from './delete-tool'
import MaterialTool from './material-tool'
import AssetTool from './asset-tool'
import GeometryTool from './geometry-tool'
import SystemTool from './system-tool'
import PlaceTool from './place-tool'
import WorldTool from './world-tool'
import FileTool from './file-tool'
import SocialTool from './social-tool'
import DebugTool from './debug-tool.js'
import CustomTool from './custom-tool'
import { GRID_SIZE } from '../config'

export default class Toolbox {
    constructor ( user, world ) {

      this.world = world
      this.user = user
      this.hands = []
      console.warn(this.user.avatar)
      this.user.avatar.componentsByProp.hand.map(( m, i )=>{

        if ( i < 3 ) {

          this.hands.push( m )

        }

      })

      this.fadeTimeout = 0
      this.tools = [
        new EntityTool({}, world, this),
        new ComponentTool({}, world, this),
        new SystemTool({}, world, this),
        new GeometryTool({}, world, this),
        new MaterialTool({}, world, this),
        new WorldTool({}, world, this),
        new PlaceTool({}, world, this),
        new AssetTool({}, world, this),
        new FileTool({}, world, this),
        new SocialTool({}, world, this),
        new DebugTool({}, world, this),
        new DeleteTool({}, world, this)
      ]
      this.currentTools = [ 0, 0 ]

    }

    showMenu() {
      
      this.user.hud.componentsByProp.toolUI[0].state.toolUI.updatePosition()

    }


    nextTool( direction ) {

      let hand = 0
      this.showMenu()

      while ( hand < 2) {

        if ( this.currentTools[ hand ] < 0 ) {

          this.currentTools[ hand ] = this.tools.length - 1

        } else if ( this.currentTools[ hand ] >= this.tools.length ) {

          this.currentTools[ hand ] = 0

        }

        hand ++

      }

      this.currentTools[hand] += direction
      
    }

    useTool ( index, hand, noHUDUpdate) {

      this.tools[ this.currentTools[ hand ] ].unequip()
      this.currentTools[ hand ] = index
      this.tools[ index ].equip( hand )

      if ( !!!noHUDUpdate ) {
        
        this.showMenu()
        this.user.hud.componentsByProp.toolUI[ 0 ].state.toolUI.switchTool( index, hand )
        
      }

    }

    getTools () {

      return this.tools

    }

    getCurrentTool ( hand ) {

      return this.tools[ this.currentTools[ hand ] ]

    }

    addTool ( data ) {

      this.tools.push( new CustomTool( data ) )
      // use tool prop of.. component / entity that is tool that is being added
      // implement this

    }

    initActionTelemetry ( camera, useCursor, hand ) {

      let input = this.world.userInput,
          position = camera.position.toArray(),
          voxel = [ position[0], 0, position[2] ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) ),
          quaternion = camera.quaternion.toArray(),
          user = this.world.user,
          cursors = user.avatar.componentsByProp.cursor,
          cursor = null,
          cursorPos = null,
          handMesh = null
          
      if ( useCursor ) {

        if ( input.trackedControls || input.leapMotion ) { // set position from tracked controller

          cursor = cursors[ hand + 1 ]
          handMesh = this.hands[ hand ].mesh

        } else {

          cursor = cursors[ 0 ]

        }

        cursor.mesh.updateMatrixWorld()
        !!cursor.mesh.parent && cursor.mesh.parent.updateMatrix()
        cursorPos = cursor.mesh.localToWorld( new THREE.Vector3() )
        position = cursorPos.toArray()

        if ( handMesh != null ) {

          quaternion = handMesh.quaternion.toArray()

        }

      }

      return {
        voxel,
        position,
        quaternion,
        cursor,
        handMesh,
        hand
      }

    }
    
    usePrimary ( hand ) {

      let toolIndex = this.currentTools[ hand ],
          tool = this.tools[ toolIndex ],
          camera = this.world.camera,
          telemetry = this.initActionTelemetry(camera, true, hand),
          { position, quaternion, voxel } = telemetry,
          cursorEntity = !!telemetry.cursor ? telemetry.cursor.state.cursor.entity : false,
          cursorState = !!telemetry.cursor ? telemetry.cursor.state : false,
          componentsByProp =  !!cursorEntity ? cursorEntity.componentsByProp : {},
          configureTool = null,
          action = null
      
      if ( telemetry.cursor && cursorEntity ) { // check telemetry here to see if activate callbacks should fire instead of tool action

        if ( cursorEntity.componentsByProp.activate ) { 

          !!cursorState.component && console.log("*** usePrimary ", cursorState.component )
          !!cursorState.component && cursorState.component.state.activate.callbacks.map( (callback) => {
              callback() // action is handled by checking component props ( besides .activate )
          })
          
          return // cursor system has found the component ( provided all has gone according to plan.. )

        }

        if ( componentsByProp.miniature && componentsByProp.toolUI ) {

          configureTool = componentsByProp.toolUI[ 0 ].props.toolUI.configureTool 

            if ( configureTool ) {

              if ( toolIndex != configureTool.tool ) {

                this.currentTools[ hand ] = configureTool.tool
                tool = this.tools[ configureTool.tool ]

              }         

              tool.configure( configureTool ); //console.log(" configure tool: ", configureTool )

            }
        }

      }

      if ( tool.mesh == null ) {

        tool.equip(hand)
        
      }

      action = tool.primaryAction(telemetry)

      if ( !!action ) {

        this.sendToolAction( true, tool, hand, position, quaternion, action.entity, action.entityId, action.components, action.coords )

      }

    }

    useSecondary( hand, value ) {

      let tool = this.tools[this.currentTools[hand]],
          camera = this.world.camera,
          telemetry = this.initActionTelemetry(camera, true, hand),
        { position, quaternion } = telemetry,
          action = false
          
      if ( tool.mesh == null ) {

          tool.equip(hand)

      }

      action = tool.secondaryAction(telemetry, value)
      
      if (!!action) {

        this.sendToolAction( false, tool, hand, position, quaternion, action.entity, action.entityId, action.components, action.coords )

      }

    }

    grip ( handIndex, value ) {

      let hand = this.hands[handIndex].mesh,
          entity = null, //hand.children[0].userData.component.props.,
          cursor = null,
          pos = [0,0,0], //entity.mesh.position,
          coords = [0,0,0],
          voxels = this.world.terrain.voxels
     
      if ( this.user.avatar ) {

        cursor = this.user.avatar.componentsByProp.cursor[1+hand]
        entity = !!cursor ? cursor.state.cursor.entity : false
        pos = !!entity ? entity.mesh.position.toArray() : pos

      }

      if ( !! entity ) {
        
        if ( value == -1 ) {

          hand.remove(entity.mesh)
          three.scene.add(entity.mesh)
          entity.update([hand.position.x, hand.position.y, hand.position.z])
          hand.userData.grabbedEntity = false
          // probably use haptic system for state ^^^
          //coords = [Math.floor(pos.x / 928000), 0, Math.floor(pos.z / 807360)],
        } else {

          if (!!! hand.userData.grabbedEntity) {

            three.scene.remove(entity.mesh)
            hand.userData.grabbedEntity = entity
            hand.add(entity.mesh)
            //entity.update( [0, 0, 0] )
            entity.mesh.position.fromArray([0,0,0])

          }

        }
        
      }
      // show feedback
    }

    setHandOrientation ( hand, position, orientation ) {

      let userHand = !!this.hands[hand] ? this.hands[hand].mesh : false

      if ( userHand ) {
        userHand.autoUpdateMatrix = false
        userHand.position.fromArray(position).multiplyScalar(22000).add(this.world.camera.position)
        userHand.translateX(725+ hand*-1250)
        userHand.position.y += -22000+this.world.floorHeight*6
        userHand.quaternion.fromArray(orientation)

      }

    }

    sendToolAction ( primary, tool, hand, position, quaternion, entity, entityId = -1, components = [], coords ) {

      let camera = this.world.camera,
          cPos = camera.position,
          toolName = tool.name

     if ( !!!coords )

        coords = [ Math.floor(cPos.x / 928000), 0, Math.floor(cPos.z / 807360) ]

     entity.voxel = coords

      let actionData = {
        tool: toolName,
        world: this.world.name,
        user: this.user.username,
        userId: this.user.id,
        hand,
        position,
        quaternion,
        options: tool.options,
        coords,
        components,
        entity,
        entityId,
        primary
      }

      send("tool action", actionData)
    }
}
