import Tool from '../../../../world/tool'
import Entity from '../../../../entity'
import { GRID_SIZE } from '../../../../config'

export default class FileTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

      let cameraPos = world.three.camera.position,
          coords =  [ cameraPos.x, 0, cameraPos.z ].map( (c, i) => Math.floor( c / GRID_SIZE[ i ] ) )

      this.mesh = null
      this.name = "File Tool"
      this.options = {

      }

      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [ 0.1, 0.1, 0.4 ]
              },
              material: {
                name: "metal"
              },
              tool: {
                panels: [
                  {
                    title: "Files",
                    color: 0x07ff07,
                    content: {
                      props: {
                        metaFactory: { // generates factory for each item in dataSource
                          type: "file", // entity, prop, place, world, user, file, directory
                          //propName: "geometry",
                          dataSource: this.world.systems.assets.files
                        }
                      }
                    }
                  },
                  {
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
                ]
              }
            },
            components: [
              this.initLabel( false, "Files")
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
