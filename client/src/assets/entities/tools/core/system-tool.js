import Tool from '../../../../world/tool'
import Entity from '../../../../entity'
import { GRID_SIZE } from '../../../../config'

export default class SystemTool extends Tool {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

    let cameraPos = world.three.camera.position,
        coords =  [ cameraPos.x, 0, cameraPos.z ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

    this.mesh = null;
    this.name = "System Tool"
    this.options = {
      system: {
        none: true
      }
    }
    this.all = [ "structures", "vehicles", "media", "interactivity" ]
    this.current = 0
    
    this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [0.08, 0.5, 2]
              },
              material: {
                name: "metal"
              },
              tool: {
                panels: [
                  {
                    title: "Systems",
                    color: 0xff0707,
                    content: {
                      props: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "prop", // entity, component, prop
                          propName: "structures",
                          dataSource: this.world.systems.assets.props.systems
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
                    title: "Vehicular",
                    color: 0xff0707,
                    content: {
                      props: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "prop", // entity, component, prop
                          propName: "vehicles",
                          dataSource: this.world.systems.assets.props.systems
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
                    title: "Media",
                    color: 0xff0707,
                    content: {
                      props: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "prop", // entity, component, prop
                          propName: "media",
                          dataSource: this.world.systems.assets.props.systems
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
                    title: "Interactivity",
                    color: 0xff0707,
                    content: {
                      props: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "prop", // entity, component, prop
                          propName: "interactivity",
                          dataSource: this.world.systems.assets.props.systems
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
              this.initLabel( false, "System")
            ]
          }
        ], null, null, coords)
        
    }

    primaryAction ( telemetry) {
      
      let options = this.options,
          cursor = telemetry.cursor,
          user = this.world.user,
          systems = this.world.systems,
          assetSystem = systems.assets,
          cursorSystem = systems.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          coords = telemetry.voxel,
          props = {},
          components = [],
          entityId = -1,
          entity = null
      
      if ( options.system && options.system.none ) return

      // gotta implement, yo

        
    }

    secondaryAction ( telemetry, value) {
      
    }

    configure ( config ) {
      
      if ( typeof config == 'object' && Object.keys(config).length > 0 ) {
        this.options = Object.assign( {}, config.data )
        console.log("Configuring tool ", this.options)
      }
      
  }

  generatePreview( component, preset, data ) {
    
    let preview = null
    
    return preview
    
  }
    
}