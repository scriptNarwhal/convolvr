import Tool from '../../../../world/tool'
import Entity from '../../../../model/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class EntityTool extends Tool  {

  constructor ( data, world, toolbox ) {
    super(data, world, toolbox)
    let assets = world.systems.assets,
        allEntities = assets.entitiesByName,
        allOptions = [],
        cameraPos = world.three.camera.position,
        coords = GLOBAL_SPACE

      Object.keys( allEntities ).map( name => {
        if ( name != "default-avatar" && name != "tool-menu" && name != "help-screen" && name != "chat-screen" )
          allOptions.push( name ) 

      })

      this.mesh = null
      this.name = "Entity Tool"
      this.options = {
        entityType: allOptions[ 3 ]
      }
      this.all = allOptions
      this.current = 3
      this.entity = new Entity(-1, [
          {
            attrs: {
              geometry: {
                shape: "box",
                size: [ 0.5, 0.34, 1.333 ]
              },
              material: {
                name: "metal",
                color: 0x000000
              },
              tool: {
                panels: [
                  {
                    title: "Entities",
                    color: 0x07ff00,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "entity", // component, attr
                          // attrName: "userEntities", // toggle to user's entities
                          dataSource: this.world.systems.assets.entities,
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
                  },
                  {
                    title: "Script Expressions",
                    color: 0x07ff00,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "entity", 
                          dataSource: this.world.systems.assets.entities,
                          filter: {
                            tags: ["ecs-expression"]
                          }
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },
                  {
                    title: "Script Statements",
                    color: 0x07ff00,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "entity", 
                          dataSource: this.world.systems.assets.entities,
                          filter: {
                            tags: ["ecs-statement"]
                          }
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },
                  {
                    title: "Computer Hardware",
                    color: 0x07ff00,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "entity", 
                          dataSource: this.world.systems.assets.entities,
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
                  },
                  // {
                  //   title: "My Entities",
                  //   color: 0x07ff00,
                  //   content: {
                  //     attrs: {
                  //       metaFactory: { // generates factory for each item in dataSource
                  //         type: "entity", // component, attr
                  //         // attrName: "userEntities", // toggle to user's entities
                  //         dataSource: this.world.systems.assets.userEntities
                  //       },
                  //       layout: {
                  //         type: "grid",
                  //         mode: "factory", // child components will ignore layout
                  //         columns: 3
                  //       }
                  //     }
                  //   }
                  // }
                ]
              }
            },
            components: [
              this.initLabel( false, "Entity" )
            ]
          }
        ], [0,0,0], [0,0,0,1], coords)

    }

    primaryAction ( telemetry, params = {} ) { // place entity
      let cursor = telemetry.cursor,
          cursorState = cursor.state.cursor || {},
          systems = this.world.systems,
          cursorSystem = systems.cursor,
          assetSystem = systems.assets,
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          user = this.world.user,
          entity =  params.entity ? 
            params.entity : 
            assetSystem.makeEntity( 
              this.options.entityType, 
              null, 
              {}, 
              telemetry.voxel 
            ),
          tooManyComponents = !!selected && selected.components.length >= 48,
          pointingAtTerrain = !!selected && selected.componentsByAttr.terrain
  
      console.log( "( Entity Tool )", telemetry, params, entity )

      if ( ! tooManyComponents ) {
        if ( 
          selected && selected.componentsByAttr &&
          !!!selected.componentsByAttr.miniature && 
          (cursorState.distance < 100)
        ) { // switch to component tool
            user.toolbox.useTool( 1, telemetry.hand, false )
            user.hud.componentsByAttr.toolUI[0].state.toolUI.show()
            //user.toolbox.usePrimary( telemetry.hand )
            return false
        }
      }
      
      if ( entity && cursorSystem.entityCoolDown <= 0 ) {
        cursorSystem.entityCoolDown = 80
        return {
          entity
        }
      } else {
        console.log(" ( No entity ) ", params.entity, entity )
        return false
      }
    }

    secondaryAction ( telemetry, value ) {
      this.current += value // cycle entities
      if ( this.current >= this.all.length ) {
        this.current = 0
      } else if ( this.current < 0 ) {
        this.current = this.all.length -1
      }
      this.selectedEntity = null
      this.options.entityType = this.all[ this.current ]
      if ( this.entity.componentsByAttr ) {
        this.entity.componentsByAttr.text[ 0 ].state.text.update( 
          this.options.entityType 
        )
      }
      return false // no socket event
    }
    
    configure ( config ) {
      this.options.entityType = config.preset
    }

    generatePreview( component, preset, data ) {
      let preview = null
      
      return preview
    }
}
