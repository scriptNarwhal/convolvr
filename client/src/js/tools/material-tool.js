import Tool from './tool'
import Entity from '../entity'

export default class MaterialTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null;
      this.name = "Material Tool"
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [3000, 1200, 8000]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Materials",
                  color: 0x07ffff,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        propName: "material",
                        dataSource: this.world.systems.assets.props.material
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel( false, "Material")
            ]
          }
        ])
    }

    primaryAction (telemetry) {
      
    }

    secondaryAction (telemetry, value) {
    
    }
}
