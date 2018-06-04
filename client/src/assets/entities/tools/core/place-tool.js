import Tool from '../../../../world/tool'
import Entity from '../../../../core/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class PlaceTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

      let cameraPos = world.three.camera.position,
          coords = GLOBAL_SPACE

      this.mesh = null
      this.name = "Geometry Tool"
      this.options = {

      }

      this.entity = new Entity(-1, [
          {
            attrs: {
              geometry: {
                shape: "box",
                size: [ 0.5, 0.34, 1.333 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Places",
                  color: 0x07ff07,
                  content: {
                    attrs: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "place", // entity, attr, place, world, user, file, directory
                        //attrName: "geometry",
                        dataSource: this.world.systems.assets.places
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
              this.initLabel( false, "Places")
            ]
          }
        ],
        [0,0,0],
        [0,0,0,1],
        coords)

    }

    primaryAction ( telemetry ) {
      
    }

    secondaryAction ( telemetry, value ) {
    
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
