import Tool from './tool'
import Entity from '../../entity'
import EntityGenerator from '../../entity-generator'
/* delete (voxel | component | entity) tool */
export default class DeleteTool extends Tool  {
    constructor (data, world, toolbox) {
      super(data, world, toolbox)
      this.mesh = null
      this.name = "Delete Tool"
      this.icon = this.initIcon()
      this.generator = this.generator || new EntityGenerator()
      this.options = {

      }
      this.entity = new Entity(-1, [
          {
            props: {
              geometry: {
                shape: "box",
                size: [2600, 2200, 8000]
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
      let mesh = null,
          entity = null
          
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
      // remove entity
    }

    secondaryAction (telemetry, value) {
      //
    }
}
