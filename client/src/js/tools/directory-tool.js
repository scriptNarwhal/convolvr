import Tool from './tool'
import Entity from '../entity'

export default class DirectoryTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )
      this.mesh = null
      this.name = "Directory Tool"
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
                  title: "Directories",
                  color: 0x07ff07,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "directory", // entity, prop, place, world, user, file, directory
                        //propName: "geometry",
                        dataSource: this.world.systems.assets.directories
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Directories")
            ]
          }
        ])

    }

    primaryAction ( telemetry ) {
      
    }

    secondaryAction ( telemetry, value ) {
    
    }
    
}
