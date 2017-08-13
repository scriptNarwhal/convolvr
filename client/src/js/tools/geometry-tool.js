import Tool from './tool'
import Entity from '../entity'
import { GRID_SIZE } from '../config'

export default class GeometryTool extends Tool {
  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

      let cameraPos = world.three.camera.position,
          coords =  [ cameraPos[0], 0, cameraPos[2] ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

      this.mesh = null
      this.name = "Geometry Tool"
      this.options = {

      }

      this.entity = new Entity(-1, coords, [
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
                  title: "Geometries",
                  color: 0xff8007,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        propName: "geometry",
                        dataSource: this.world.systems.assets.props.geometry
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Geometry")
            ]
          }
        ])

    }

    primaryAction ( telemetry ) {
      
    }

    secondaryAction ( telemetry, value ) {
    
    }

    configure ( config ) {

    }

}