import Tool from '../../../../world/tool'
import Component from '../../../../model/component'
import Entity from '../../../../model/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class ComponentTool extends Tool {
  constructor ( data, world, toolbox ) {

    super( data, world, toolbox )

      let assets = world.systems.byName.assets,
          components = assets.componentsByName,
          allOptions = [],
          cameraPos = world.three.camera.position,
          coords = GLOBAL_SPACE
  
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
            attrs: {
              geometry: {
                shape: "box",
                size: [ 1.0, 0.34, 2.333 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panels: [
                  { // helper to create tool configuration-panel entity ( coordinated by tool system )
                    title: "Components",
                    color: 0x003bff,
                    content: {
                      attrs: {
                        factoryProvider: { // generates factory for each item in dataSource
                          type: "component", // component, entity, attr
                          dataSource: this.world.systems.byName.assets.componentsByName,
                          filter: { 
                            tags: []
                          }
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },{ // helper to create tool configuration-panel entity ( coordinated by tool system )
                    title: "Script Literals",
                    color: 0x003bff,
                    content: {
                      attrs: {
                        factoryProvider: { // generates factory for each item in dataSource
                          type: "component", // component, entity, attr
                          dataSource: this.world.systems.byName.assets.componentsByName,
                          filter: {
                            tags: ["ecs-literal"]
                          }
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },{ // helper to create tool configuration-panel entity ( coordinated by tool system )
                    title: "Script Objects",
                    color: 0x003bff,
                    content: {
                      attrs: {
                        factoryProvider: { // generates factory for each item in dataSource
                          type: "component", // component, entity, attr
                          dataSource: this.world.systems.byName.assets.componentsByName,
                          filter: {
                            tags: ["ecs-object"]
                          }
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },{ // helper to create tool configuration-panel entity ( coordinated by tool system )
                    title: "PC Devices",
                    color: 0x003bff,
                    content: {
                      attrs: {
                        factoryProvider: { // generates factory for each item in dataSource
                          type: "component", // component, entity, attr
                          dataSource: this.world.systems.byName.assets.componentsByName,
                          filter: {
                            tags: ["information-hardware"]
                          }
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  }
                  // },{ // helper to create tool configuration-panel entity ( coordinated by tool system )
                  //   title: "My Components",
                  //   color: 0x003bff,
                  //   content: {
                  //     attrs: {
                  //       factoryProvider: { // generates factory for each item in dataSource
                  //         type: "component", // component, entity, attr
                  //         dataSource: this.world.systems.byName.assets.userComponents
                  //       },
                  //       layout: {
                  //         type: "grid",
                  //         mode: "factory", // child components will ignore layout
                  //         columns: 3
                  //       }
                  //     }
                  //   }
                  // },
                ]
              }
            },
            components: [
              this.initLabel( false, "Component")
            ]
          }
        ],
        [0,0,0], [0,0,0,1], coords);

    }

    // going to refactor this into the tool system.. next release
    primaryAction(telemetry, params = {} ) { // place component (into entity if pointing at one)

      let cursor = telemetry.cursor,
          user = this.world.user,
          systems = this.world.systems,
          assetSystem = systems.byName.assets,
          cursorSystem = systems.byName.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          componentType = !!params.component ? params.component : this.options.componentType,
          component = assetSystem.makeComponent( componentType ),
          tooManyComponents = !!selected && selected.components.length >= 48,
          pointingAtTerrain = !!selected && selected.componentsByAttr.terrain,
          coords = telemetry.voxel,
          attrs = {},
          components = [],
          entityId = -1,
          entity = null //console.log("Selected ", tooManyComponents, selected, selected.components)
      
      // console.log( " Component Tool", selected ? selected.components : 0)
      // console.log( selected )
      entity = new Entity( 0, [ component ], [ 0, 0, 0 ], quat, coords )

      //console.warn( `Component Tool Type ${componentType} Selected`, selected )
      if ( cursorSystem.entityCoolDown > 5 )
        return false // stop spamming lol.. // console.log("too many components; waiting for entity cooldown; aborting")
      if (  /*pointingAtTerrain ||*/ (( !!!selected || cursorState.distance > 100 || ( cursorState.distance < 100 && tooManyComponents ))) )  { // switch back to entity tool, if the user is clicking into empty space //  console.log("switching to entity tool for whatever reason...")
        console.warn(" Problem ")
        user.toolbox.useTool( 0, telemetry.hand )
        user.hud.componentsByAttr.toolUI[ 0 ].state.toolUI.show()
        // user.toolbox.usePrimary( telemetry.hand, entity  )
        return false
      }

      entityId = selected.id

      if ( components.length == 0 )
        components = [ component ]
      
      attrs = selected.componentsByAttr

      if ( !!!selected ) { //
        console.warn("Component Tool: no entity selected")
        return false 

      } else {
        coords = selected.voxel
      }

      !!selected && !!selected.mesh && selected.mesh.updateMatrixWorld()
      let selectedPos = !!selected && !!selected.mesh ? selected.mesh.localToWorld( new THREE.Vector3() ) : false
      
      components.map( ( comp, i ) => { // apply transformation and offset to components
        if ( !!comp ) {
          if ( selectedPos )
            comp.position = [
              position[ 0 ] - selectedPos.x,
              position[ 1 ] - selectedPos.y,
              position[ 2 ] - selectedPos.z
            ]
          comp.quaternion = quat
        }
      })

      cursorSystem.entityCoolDown = 50

      return {
        coords,
        entity,
        entityId,
        components
      }
    }

    secondaryAction(telemetry, value) {
      this.current += value // cycle components

      if ( this.current >= this.all.length ) {
        this.current = 0
      } else if ( this.current < 0 ) {
        this.current = this.all.length - 1
      }
      
      this.selectedComponent = null
      this.options.componentType = this.all[ this.current ]

      if ( this.entity.componentsByAttr ) {
        this.entity.componentsByAttr.text[ 0 ].state.text.update( this.options.componentType )
      }

      return false // no socket event
    }

    configure ( config ) {
      console.log("configure component tool", config)
      this.options.componentType = config.preset
    }

    generatePreview( component, preset, data ) {
      
      let preview = null
      
      return preview 
    }
}
