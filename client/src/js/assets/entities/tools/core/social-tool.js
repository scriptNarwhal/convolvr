import Tool from './tool'
import Entity from '../../../../entity'
import { GRID_SIZE } from '../../../../config'

export default class SocialTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

    let cameraPos = world.three.camera.position,
        coords =  [ cameraPos.x, 0, cameraPos.z ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

    this.mesh = null
    this.name = "Social Tool"
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
                  title: "Social Networks",
                  color: 0x07ff07,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "social", // entity, prop, place, world, user, file, directory
                        //propName: "geometry",
                        dataSource: this.world.systems.socialMedia.friends
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
        ], [0,0,0], [0,0,0,1], coords)

    }

    primaryAction ( telemetry ) {
      
    }

    secondaryAction ( telemetry, value ) {
    
    }
    
    configure ( config ) {

    }
    
}
