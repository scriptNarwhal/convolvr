import Tool from './tool'
import EntityGenerator from '../../entities/entity-generator'
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
    }

    initIcon () {
      let mesh = null,
          entity = null
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity("icon", true)
      entity.components.push({
        props: {},
        shape: "box",
        size: [2640, 2640, 2640],
        position: [0, 0, 0],
        color: 0xff0707,
        text: "",
        quaternion: null
      })
      return entity
    }

    primaryAction () {
      // remove entity
    }

    secondaryAction () {
      //
    }
}
