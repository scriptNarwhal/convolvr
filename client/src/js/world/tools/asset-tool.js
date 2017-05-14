import Tool from './tool'
import Entity from '../../entity'
import EntityGenerator from '../../entity-generator'
/* terrain voxel tool */
export default class AssetTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null;
      this.name = "Asset Tool"
      this.icon = this.initIcon()
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
                  title: "Assets",
                  color: 0xff0707,
                  content: {
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        propName: "asset",
                        dataSource: this.world.systems.assets.props.asset
                      }
                    }
                  }
                }
              }
            },
            components: [
              this.initLabel("Asset Tool")
            ]
          }
        ])
    }

    initIcon () {
      
      let entity = null
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity("icon", true)
      entity.components.push({
        props: {
          material: {
            name: "metal",
            color: 0xff0707
          },
          geometry: {
            shape: "box",
            size: [4500, 4500, 4500]
          }
        },
        position: [0, 0, 0],
        quaternion: null
      })
      return entity

    }

    primaryAction (telemetry) {
      
    }

    secondaryAction (telemetry, value) {
    
    }
}
