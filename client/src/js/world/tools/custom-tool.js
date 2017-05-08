import Tool from './tool'
import EntityGenerator from '../../entity-generator'

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
        props: {
          geometry: {
            shape: "box",
            size: [4500, 4500, 4500]
          },
          material: {
            name: 'metal',
            color: 0x003bff
          }
        },
        position: [0, 0, 0],
        quaternion: null
      })
      return entity
    }

    primaryAction () {

    }

    secondaryAction (telemetry, value) {

    }

}
