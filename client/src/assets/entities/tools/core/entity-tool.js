import Tool from '../../../../world/tool'
import Entity from '../../../../core/entity'
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
                size: [ 0.3, 0.2, 0.433 ]
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
                          dataSource: this.world.systems.assets.entities
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  },{
                    title: "My Entities",
                    color: 0x07ff00,
                    content: {
                      attrs: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "entity", // component, attr
                          // attrName: "userEntities", // toggle to user's entities
                          dataSource: this.world.systems.assets.userEntities
                        },
                        layout: {
                          type: "grid",
                          mode: "factory", // child components will ignore layout
                          columns: 3
                        }
                      }
                    }
                  }
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
          pointingAtTerrain = !!selected && selected.componentsByProp.terrain
  
      console.log( "( Entity Tool )", telemetry, params, entity )

      if ( ! tooManyComponents ) {
        if ( 
          selected && selected.componentsByProp &&
          !!!selected.componentsByProp.miniature && 
          (cursorState.distance < 100)
        ) { // switch to component tool
            user.toolbox.useTool( 1, telemetry.hand, false )
            user.hud.componentsByProp.toolUI[0].state.toolUI.show()
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
      if ( this.entity.componentsByProp ) {
        this.entity.componentsByProp.text[ 0 ].state.text.update( 
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
