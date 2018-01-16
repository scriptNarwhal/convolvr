import Tool from '../../../../world/tool'
import Entity from '../../../../entity'
import { GRID_SIZE } from '../../../../config'

export default class EntityTool extends Tool  {

  constructor ( data, world, toolbox ) {

    super(data, world, toolbox)

    let assets = world.systems.assets,
        allEntities = assets.entitiesByName,
        allOptions = [],
        cameraPos = world.three.camera.position,
        coords =  [ cameraPos.x, 0, cameraPos.z ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

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
            props: {
              geometry: {
                shape: "box",
                size: [ 0.08, 0.05, 0.333 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panels: [
                  {
                    title: "Entities",
                    color: 0x07ff00,
                    content: {
                      props: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "entity", // component, prop
                          // propName: "userEntities", // toggle to user's entities
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
                      props: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "entity", // component, prop
                          // propName: "userEntities", // toggle to user's entities
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
          entity =  params.entity ? params.entity : assetSystem.makeEntity( this.options.entityType, null, {}, telemetry.voxel ),
          tooManyComponents = !!selected && selected.components.length >= 48,
          pointingAtTerrain = !!selected && selected.componentsByProp.terrain
  
      console.log( "( Entity Tool )", telemetry, params, entity )

      if ( ! tooManyComponents ) {
        if ( selected && selected.componentsByProp && !!!selected.componentsByProp.miniature && (cursorState.distance < 100) ) { // switch to component tool
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
        this.entity.componentsByProp.text[ 0 ].state.text.update( this.options.entityType )
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
