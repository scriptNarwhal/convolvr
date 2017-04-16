import Tool from './tool'
import Entity from '../../entities/entity'
import EntityGenerator from '../../entities/entity-generator'
/* terrain voxel tool */
export default class SystemTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null;
      this.name = "System Tool"
      this.icon = this.initIcon()
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [1600, 4200, 6000]
              },
              material: {
                name: "metal"
              },
              tool: {

              }
            }
          }
        ])
    }

    initIcon () {
      let entity = null
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity("icon", true)
      entity.components.push({
        props: {
          geometry: {
            shape: "box",
            size: [4500, 4500, 4500]
          },
          material: {
            name: 'metal',
            color: 0xef07ff
          }
        },
        position: [0, 0, 0],
        quaternion: null
      })
      return entity
    }

    primaryAction (telemetry) {
      // create voxel
    }

    secondaryAction (telemetry, value) {
      // remove voxel
    }
}
