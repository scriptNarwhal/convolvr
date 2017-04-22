import Tool from './tool'
import Entity from '../../entities/entity'
import EntityGenerator from '../../entities/entity-generator'
/* terrain voxel tool */
export default class VoxelTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null;
      this.name = "Voxel Tool"
      this.icon = this.initIcon()
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [1600, 1200, 7000]
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
          material: {
            name: "metal",
            color: 0xff8707
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
      // create voxel
    }

    secondaryAction (telemetry, value) {
      // remove voxel
    }
}
