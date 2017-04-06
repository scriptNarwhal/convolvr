import Tool from './tool'
import EntityGenerator from '../../entities/entity-generator'

export default class CustomTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null
      this.name = data ? data.name : "New Custom Tool"
      this.generator = this.generator || new EntityGenerator()
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
        color: 0xffffff,
        text: "",
        quaternion: null
      })
      return entity
    }

    primaryAction () {

    }

    secondaryAction (telemetry, value) {

    }

}
