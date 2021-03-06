import Tool from '../../../../world/tool'
import Entity from '../../../../model/entity'
import { GRID_SIZE, GLOBAL_SPACE } from '../../../../config'

export default class FileTool extends Tool {

  constructor ( data, world, toolbox ) {

    super ( data, world, toolbox )

      let cameraPos = world.three.camera.position,
          coords = GLOBAL_SPACE

      this.mesh = null
      this.name = "File Tool"
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
                panels: [
                  {
                    title: "Files",
                    color: 0x07ff07,
                    content: {
                      attrs: {
                        file: {
                          listFiles: {
                            username: "Public",
                            dir: "/"
                          }
                        },
                        // factoryProvider: { // generates factory for each item in dataSource
                        //   type: "file", // entity, attr, place, world, user, file, directory
                        //   //attrName: "geometry",
                        //   dataSource: this.world.systems.assets.files
                        // }
                      }
                    }
                  },
                  {
                    title: "Directories",
                    color: 0x07ff07,
                    content: {
                      attrs: {
                        file: {
                          listDirectories: {
                            username: "Public",
                            dir: "/"
                          }
                        },
                        // factoryProvider: { // generates factory for each item in dataSource
                        //   type: "directory", // entity, attr, place, world, user, file, directory
                        //   //attrName: "geometry",
                        //   dataSource: this.world.systems.assets.directories
                        // }
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
