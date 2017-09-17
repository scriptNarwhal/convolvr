import Tool from './tool'
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
                size: [1600, 4200, 6000]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Systems",
                  color: 0xff0707,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        propName: "vehicles",
                        dataSource: this.world.systems.assets.props.systems
                      },
                      layout: {
                        type: "tube",
                        axis: "y",
                        mode: "factory", // child components will ignore layout
                        columns: 3
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "System")
            ]
          }
        ], null, null, coords)
        
    }

    primaryAction ( telemetry) {
      
      let system = this.options.system,
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
      
      if ( system.none ) return
        
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
