import Tool from './tool'
import Entity from '../entity'
import { GRID_SIZE } from '../config'

export default class SystemTool extends Tool {

  constructor (data, world, toolbox) {

    super(data, world, toolbox)

    let cameraPos = world.three.camera.position,
        coords =  [ cameraPos[0], 0, cameraPos[2] ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

    this.mesh = null;
    this.name = "System Tool"
    this.options = {

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
        ],
        null,
        null,
        coords)
        
    }

    primaryAction ( telemetry) {
      
    }

    secondaryAction ( telemetry, value) {
      
    }

    configure ( config ) {

    }
    
}
