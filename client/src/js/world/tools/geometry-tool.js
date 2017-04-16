import Tool from './tool'
import Entity from '../../entities/entity'
import EntityGenerator from '../../entities/entity-generator'
/* terrain voxel tool */
export default class GeometryTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null;
      this.name = "Geometry Tool"
      this.icon = this.initIcon()
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [2200, 2200, 9000]
              },
              material: {
                name: "metal"
              },
              tool: {
                panel: {
                  title: "Geometries",
                  content: new Entity(-1, [{
                    props: {
                      metaFactory: { // generates factory for each item in dataSource
                        type: "prop", // entity, prop
                        dataSource: this.world.systems.assets.props.geometry
                      }
                    }
                  }], [0,0,0], false)
                }
              }
            },
            components: [
              this.initLabel("Geometry")
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
            color: 0xffa707
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
