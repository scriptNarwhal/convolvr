/* toolbox */
import {send} from '../../network/socket'
import ComponentTool from '../../assets/entities/tools/core/component-tool'
import EntityTool from '../../assets/entities/tools/core/entity-tool'
import DeleteTool from '../../assets/entities/tools/core/delete-tool'
import MaterialTool from '../../assets/entities/tools/core/material-tool'
import PropertyTool from '../../assets/entities/tools/core/property-tool'
import GeometryTool from '../../assets/entities/tools/core/geometry-tool'
import AttributeTool from '../../assets/entities/tools/core/attribute-tool'
import PlaceTool from '../../assets/entities/tools/core/place-tool'
import SpaceTool from '../../assets/entities/tools/core/world-tool'
import FileTool from '../../assets/entities/tools/core/file-tool'
import SocialTool from '../../assets/entities/tools/core/social-tool'
import DebugTool from '../../assets/entities/tools/core/debug-tool.js'
import CustomTool from '../../assets/entities/tools/core/custom-tool'
import { GRID_SIZE } from '../../config'
import Convolvr from '../../world/world';
import User from '../../world/user';
import { Component } from 'react';

import * as THREE from 'three';

export default class ToolboxSystem {
    
  private world: Convolvr
  private user: User
  private hands: any[]
  private currentTools: number[]
  private tools: any[]
  private toolboxComponents: Component[]
  private fadeTimeout: number

    constructor (world: Convolvr) {
        this.world = world
        this.user = world.user
        this.hands = []
        console.warn(this.user.avatar)
        this.currentTools = [ 0, 0 ]
        this.tools = []
        this.toolboxComponents = [];
        this.fadeTimeout = 0
    }

    init(component: Component) {        
        this.toolboxComponents.push( component )
        return {

        }
    }
  
    public postInject( ) {
        let world = this.world,
            user = world.user,
            toolbox = this;

        this.user = world.user
        setTimeout( ()=>{
          console.log("postInject toolbox: init avatar")
          console.log(user.avatar)
          if (user.avatar && user.avatar.addHandler) {
            user.avatar.addHandler("init", () => {
              console.log("user avatar init event handler ", user.avatar)
               user.avatar.componentsByAttr.hand.map((m: Component, i: number) => {
                 if (i < 3)
                   toolbox.hands.push(m)
               })
             })
          } else {
            // console.error("user.avatar hasn't loaded yet: User:", user)
          }

        }, 5000)

        console.info("user hands ", this.hands)
        this.tools = [
          new EntityTool({}, world, this),
          new ComponentTool({}, world, this),
          new AttributeTool({}, world, this),
          new GeometryTool({}, world, this),
          new MaterialTool({}, world, this),
          new SpaceTool({}, world, this),
          new PlaceTool({}, world, this),
          new PropertyTool({}, world, this),
          new FileTool({}, world, this),
          new DebugTool({}, world, this), // new SocialTool({}, world, this),
          new DebugTool({}, world, this),
          new DeleteTool({}, world, this)
        ]
    }
  
      showMenu() { 
        this.user.hud.componentsByAttr.toolUI[0].state.toolUI.updatePosition()
      }
  
      nextTool(direction: number ) {
        let hand = 0;

        this.showMenu()
        while ( hand < 2) {
          this.currentTools[ hand ] += direction
          if ( this.currentTools[ hand ] < 0 ) {
            this.currentTools[ hand ] = this.tools.length - 1
          } else if ( this.currentTools[ hand ] >= this.tools.length ) {
            this.currentTools[ hand ] = 0
          }
          hand += 1
        }
      }
  
      useTool(index: number, hand: number, noHUDUpdate: boolean ) {
        this.tools[ this.currentTools[ hand ] ].unequip()
        this.currentTools[ hand ] = index
        this.tools[ index ].equip( hand )
  
        if ( !!!noHUDUpdate ) {
          this.showMenu();
          console.log("move tool ui", this.user.hud);
          this.user.hud.componentsByAttr.toolUI[ 0 ].state.toolUI.switchTool( index, hand );
        }
      }
  
      getTools() {
        return this.tools
      }
  
      getCurrentTool(hand: number) {
        return this.tools[ this.currentTools[ hand ] ]
      }
  
      addTool(data: any) {
        this.tools.push( new CustomTool( data ) )
        // use tool attr of.. component / entity that is tool that is being added
        // implement this
      }
  
      getUserHands() {
        return this.user.hands
      }

      getCursor (hand: number) {
        let input    = this.world.userInput,
            user     = this.world.user,
            cursor   = null, 
            handMesh = null,
            cursors  = user.avatar.componentsByAttr.cursor
  
        if ( input.trackedControls || input.leapMotion ) { // set position from tracked controller
          cursor = cursors[ hand + 1 ]
          handMesh = this.getUserHands()[ hand ].mesh
        } else {
          cursor = cursors[ 0 ]     
        }
        return [ cursor, handMesh ]
      }
  
      initActionTelemetry (camera: any, useCursor: boolean, hand: number) {
        let position        = camera.position.toArray(),
            voxel           = [ position[0], 0, position[2] ].map((c, i) => Math.floor( c/GRID_SIZE[ i ] )),
            quaternion      = camera.quaternion.toArray(),
            user            = this.world.user,
            cursor          = null,
            cursorPos       = null,
            cursorEntity    = null,
            cursorComponent = null,
            handMesh        = null,
            componentPath   = [],
            cursorHand      = []
            
        if (useCursor) {
          cursorHand = this.getCursor( hand )
          cursor = cursorHand[ 0 ]
          handMesh = cursorHand[ 1 ]
          cursorEntity = cursor.state.cursor.entity
          cursorComponent = cursor.state.cursor.component
  
          if ( cursorComponent ) 
            componentPath = cursorComponent.path
  
          cursor.mesh.updateMatrixWorld()
          !!cursor.mesh.parent && cursor.mesh.parent.updateMatrix()
          cursorPos = cursor.mesh.localToWorld( new THREE.Vector3() )
          position = cursorPos.toArray()
  
          if ( handMesh != null )
            quaternion = handMesh.quaternion.toArray()
  
        }
  
        return {
          voxel,
          position,
          quaternion,
          cursor,
          componentPath,
          handMesh,
          hand
        }
      }
      
      usePrimary(hand: number) {
        let toolIndex        = this.currentTools[ hand ],
            tool             = this.tools[ toolIndex ],
            camera           = this.world.camera,
            telemetry        = this.initActionTelemetry(camera, true, hand),
            { 
              position, 
              quaternion, 
              voxel, 
              componentPath 
            }                = telemetry,
            cursorEntity     = !!telemetry.cursor ? telemetry.cursor.state.cursor.entity : false,
            cursorComponent  = !!cursorEntity ? telemetry.cursor.state.cursor.component: false,
            cursorState      = !!telemetry.cursor ? telemetry.cursor.state : false,
            componentsByAttr = !!cursorEntity ? cursorEntity.componentsByAttr : {},
            configureTool    = null,
            action           = null,
            miniature        = null,
            activate         = null,
            sendAction       = true
        
        tool.hidePreview()
  
        if ( telemetry.cursor && cursorEntity ) { 
          // check telemetry here to see if activate callbacks should fire instead of tool action
          if ( cursorState.component && cursorState.component.attrs.activate ) { 
            !!cursorState.component && console.warn("Activate ", cursorState.component )
            if (cursorState.component) {
              for (let callback of cursorState.component.state.activate.callbacks) {
                callback() // action is handled by checking component attrs ( besides .activate )
              }
            }
            return // cursor system has found the component ( provided all has gone according to plan.. )
          }
          //console.log("use Primary ", componentsByAttr)
          miniature = cursorEntity.componentsByAttr.miniature
        
          if ( miniature && cursorComponent && cursorComponent.attrs.toolUI ) {
            configureTool = componentsByAttr.toolUI[ 0 ].attrs.toolUI.configureTool 
            console.log("ToolUI! configure tool", configureTool)
              if ( configureTool ) {
                if ( toolIndex != configureTool.tool ) {
                  this.currentTools[ hand ] = configureTool.tool
                  tool = this.tools[ configureTool.tool ]
                }         
                tool.configure( configureTool ); //console.log(" configure tool: ", configureTool )
              }
              sendAction = false
          }
        }
  
        if ( tool.mesh == null )
          tool.equip(hand)        
        
        action = tool.primaryAction(telemetry)

        if ( action && sendAction ) {
          this.sendToolAction( 
            true, tool, hand, position, quaternion, action.entity, action.entityId,
            action.components, action.componentPath || componentPath, action.coords 
          )
        }
      }
  
      useSecondary(hand: number, value: any) {
        let tool            = this.tools[this.currentTools[hand]],
            camera          = this.world.camera,
            telemetry       = this.initActionTelemetry(camera, true, hand),
            { 
              position, 
              quaternion, 
              componentPath 
            }               = telemetry,
            action: any = false
            
        if ( tool.mesh == null ) {
            tool.equip(hand)
        }
        action = tool.secondaryAction(telemetry, value)
        //console.info( "Network Action: ", action )
  
        if ( !!action ) {
          this.sendToolAction( 
            false, tool, hand, position, quaternion, action.entity, action.entityId,
            action.components, action.componentPath || componentPath, action.coords
          )
        }
      }
  
      preview(handIndex: number) {
        let tool   = this.tools[ this.currentTools[ handIndex ] ],
            cursor = this.getCursor( handIndex )
  
        tool.preview( cursor[ 0 ] )
      }
  
      hidePreview(handIndex: number) {
        let tool = this.tools[ this.currentTools[ handIndex ] ]
        
        tool.hidePreview()
      } 
  
      grip(handIndex: number, value: number) {
        let hands = this.getUserHands(),
            hand   = hands[ handIndex ],
            handState = hand.state.hand,
            entityId = handState.grip(value),
            avatar = this.user.avatar.mesh,
            voxel = handState.grabbedEntity ? handState.grabbedEntity.voxel : [0,1,0];

        if (handState.grabbedEntity) {
          console.log("send grip tool action")
          this.sendToolAction(
            true, 
            value < 0 ? "Replace Entity" : "Grab Entity", 
            handIndex, 
            avatar.position.toArray(), 
            avatar.quaternion.toArray(), 
            null, 
            entityId, 
            null, 
            null, 
            voxel,
            // avatar.position.toArray().map((v,i) => Math.round(v/GRID_SIZE[i]))
            //handState.grabbedEntity ? handState.grabbedEntity.voxel : [0,1,0]
          )
        }
      }
  
      setHandOrientation(hand: number, position: number[], orientation: number[]) {
        let hands = this.getUserHands(),
            userHand = hands[ hand ]

       // console.info( userHand, position, orientation )
        if ( !!userHand && position && orientation ) {
          // console.log("toolbox: setHandOrientation", position )
          userHand.state.hand.setHandOrientation( position, orientation, hand )
        }
      }
  
      sendToolAction(
        primary: boolean, 
        tool: any, 
        hand: number, 
        position: number[], 
        quaternion: number[], 
        entity: any, 
        entityId = -1, 
        components: any[] = [], 
        componentPath: number[] = [], 
        coords: number[], 
        oldCoords?: number[]
      ) {
        let camera = this.world.camera,
            cPos = camera.position,
            toolName = tool.name,
            options = tool.options // implement
  
        if ( toolName == "Geometry Tool" || toolName == "Material Tool" || toolName == "System Tool" )
          toolName = "Update Tool"
  
        if ( !!!coords )
            coords = [ Math.floor(cPos.x / GRID_SIZE[ 0 ]), 0, Math.floor(cPos.z / GRID_SIZE[ 2 ]) ]
  
        if ( entity )  { 
          entity.voxel = coords 
        }
  
        let actionData: any = {
            tool: toolName,
            space: this.world.name,
            user: this.user.name,
            userId: this.user.id,
            hand,
            position,
            quaternion,
            options,
            coords,
            componentPath,
            components,
            entity,
            entityId,
            primary
          };
          
          if (oldCoords) {
            actionData.oldCoords = oldCoords;
          }
        // console.log( "ACTION DATA ", actionData)
        send("tool action", actionData)
      }
}