import Tool from './tool'
import Component from '../component'
import Entity from '../entity'

export default class ComponentTool extends Tool {
  constructor ( data, world, toolbox ) {

    super( data, world, toolbox )

      let assets = world.systems.assets,
          components = assets.componentsByName,
          allOptions = []

        Object.keys( components ).map( name => allOptions.push( name ) )
        console.log( "all components", components )


        this.mesh = null;
        this.name = "Component Tool"
        this.selectedVec3 = new THREE.Vector3()
        this.options = {
          componentType: allOptions[ 2 ]
        }
        this.all = allOptions
        this.current = 2
        this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [ 2200, 2200, 7000 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: { // helper to create tool configuration-panel entity ( coordinated by tool system )
                  title: "Components",
                  color: 0x003bff,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "component", // component, entity, prop
                        dataSource: this.world.systems.assets.components
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Component")
            ]
          }
        ])

    }

    // going to refactor this into the tool system.. next release
    primaryAction ( telemetry, params = {} ) { // place component (into entity if pointing at one)
      
      let cursor = telemetry.cursor,
          user = this.world.user,
          systems = this.world.systems,
          assetSystem = systems.assets,
          cursorSystem = systems.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          componentType = !!params.component ? params.component : this.options.componentType,
          component = assetSystem.makeComponent( componentType ),
          tooManyComponents = !!selected && selected.components.length >= 48,
          coords = [ 0, 0, 0 ],
          components = [],
          entityId = -1,
          entity = null //console.log("Selected ", tooManyComponents, selected, selected.components)

      entity = new Entity( 0, [ component ], [ 0, 0, 0 ], quat )
      
      if ( ( !!!selected || cursorState.distance > 200000 || ( cursorState.distance < 200000 && tooManyComponents )) && cursorSystem.entityCoolDown < 0 )  { // switch back to entity tool, if the user is clicking into empty space //  console.log("switching to entity tool for whatever reason...")
       
        user.toolbox.useTool( 0, telemetry.hand )
        user.hud.componentsByProp.toolUI[0].state.toolUI.show()
        user.toolbox.usePrimary( 0, entity  )
        return false

      }

      if ( tooManyComponents && cursorSystem.entityCoolDown > 0 ) {

        return false // stop spamming lol.. // console.log("too many components; waiting for entity cooldown; aborting")

      }

      entityId = selected.id

      if ( components.length == 0 ) {
        components = [component]
      }

      if ( !!!selected ) {
        
        return false 

      } else {

        coords = selected.voxel

      }

      !!selected && !!selected.mesh && selected.mesh.updateMatrixWorld()
      let selectedPos = !!selected && !!selected.mesh ? selected.mesh.localToWorld(  new THREE.Vector3() ) : false
      
      components.map(( comp, i ) => { // apply transformation and offset to components

        if ( !!comp ) {

          if ( selectedPos ) {

            comp.position = [
              position[0] - selectedPos.x,
              position[1] - selectedPos.y,
              position[2] - selectedPos.z
            ]

          }
          
          comp.quaternion = quat

        }

      })

      return {
        coords,
        entity,
        entityId,
        components
      }

    }

    secondaryAction ( telemetry, value ) {

      this.current += value // cycle components

      if (this.current >= this.all.length) {

        this.current = 0

      } else if (this.current < 0) {

        this.current = this.all.length - 1

      }
      this.selectedComponent = null
      this.options.componentType = this.all[this.current]

      if ( this.entity.componentsByProp ) {

        this.entity.componentsByProp.text[0].state.text.update( this.options.componentType )

      }

      return false // no socket event

    }

    configure ( config ) {

      this.options.componentType = config.preset
      
    }

}
