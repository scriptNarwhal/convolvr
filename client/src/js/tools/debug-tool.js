import Tool from './tool'
import Entity from '../entity'

export default class DebugTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )
      this.mesh = null
      this.name = "File Tool"
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [ 3600, 3600, 600 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Debug",
                  color: 0x07ff07,
                  content: {
                    props: {
                      debug: {
                          user: true, // check the items below for the user's avatar
                          position: true,
                          voxel: true,
                          cursors: true,
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Debugger")
            ]
          }
        ])

    }

    primaryAction ( telemetry ) {
      
    }

    secondaryAction ( telemetry, value ) {
    
    }
    
}
