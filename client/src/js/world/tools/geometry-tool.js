import Tool from './tool'
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
    }

    initIcon () {
      let entity = null
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity("icon", true)
      entity.components.push({
        props: {},
        shape: "box",
        size: [2640, 2640, 2640],
        position: [0, 0, 0],
        color: 0xff8707,
        text: "",
        quaternion: null
      })
      return entity
    }

    primaryAction () {
      
    }

    secondaryAction () {
    
    }
}
