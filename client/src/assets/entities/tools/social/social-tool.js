import Tool from '../../../../world/tool'
import Entity from '../../../../model/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class SocialTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

    let cameraPos = world.three.camera.position,
        coords = GLOBAL_SPACE

    this.mesh = null
    this.name = "Social Tool"
    this.options = {

    }

      this.entity = new Entity(-1, [
          {
            attrs: {
              geometry: {
                shape: "box",
                size: [ 0.1, 0.1, 0.4 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Social Networks",
                  color: 0x07ff07,
                  content: {
                    attrs: {
                      factoryProvider: { // generates factory for each item in dataSource
                        type: "social", // entity, attr, place, world, user, file, directory
                        //attrName: "geometry",
                        dataSource: this.world.systems.socialMedia.friends
                      },
                      layout: {
                        type: "grid",
                        mode: "factory", // child components will ignore layout
                        columns: 3
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Social Networks")
            ]
          }
        ], null, null, coords)

    }

    primaryAction ( telemetry ) {
      
    }

    secondaryAction ( telemetry, value ) {
    
    }
    
    configure ( config ) {

    }

    generatePreview( component, preset, data ) {
      
      let preview = null
      
      return preview
    }
}
