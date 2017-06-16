import Tool from './tool'
import Entity from '../entity'

export default class PlaceTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )
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
                  title: "Places",
                  color: 0x07ff07,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "place", // entity, prop, place, world, user, file, directory
                        //propName: "geometry",
                        dataSource: this.world.systems.assets.places
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Places")
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
