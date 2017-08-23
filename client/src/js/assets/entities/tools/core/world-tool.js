import Tool from './tool'
import Entity from '../../../../entity'
import { GRID_SIZE } from '../../../../config'

export default class WorldTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

    let cameraPos = world.three.camera.position,
        coords =  [ cameraPos[0], 0, cameraPos[2] ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

      this.mesh = null
      this.name = "Geometry Tool"
      this.options = {

      }

      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [ 2200, 2200, 9000 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Worlds",
                  color: 0x07ff07,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "world", // entity, prop, place, world, user, file, directory
                        //propName: "geometry",
                        dataSource: this.world.systems.assets.worlds
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Worlds")
            ]
          }
        ], [0,0,0], [0,0,0,1], coords)

    }

    primaryAction ( telemetry ) {
      
    }

    secondaryAction ( telemetry, value ) {
    
    }
    
    configure ( config ) {

    }
}
