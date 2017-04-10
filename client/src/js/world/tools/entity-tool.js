import Tool from './tool'
import Entity from '../../entities/entity'
import EntityGenerator from '../../entities/entity-generator'

export default class EntityTool extends Tool  {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
      this.mesh = null
      this.name = "Entity Tool"
      this.icon = this.initIcon()
      this.generator = this.generator || new EntityGenerator()
      this.options = {
        entityType: "panel"
      }
      this.all = ["panel", "panel2", "panel3", "block", "column", "wirebox"]
      this.current = 0
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
      let mesh = null,
          entity = null
          
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity("icon", true)
      entity.components.push({
        props: {},
        shape: "box",
        size: [2640, 2640, 2640],
        position: [0, 0, 0],
        color: 0x15ff15,
        text: "",
        quaternion: null
      })
      return entity
    }

    primaryAction () { // place entity
      let cursor = telemetry.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          entity = this.generator.makeEntity(this.options.entityType)

      if (entity.components.length == 1) {
        entity.components[0].quaternion = [quat.x, quat.y, quat.z, quat.w]
      }
      if (selected && cursorState.distance < 60000) {
          // switch to component tool
          this.world.user.toolbox.useTool(1, 0)
          this.world.user.hud.show()
          this.world.user.toolbox.usePrimary(0)
          return false
      }
      return {
        entity
      }
    }

    secondaryAction (telemetry, value) {
      // cycle entities
      this.current += value
      if (this.current >= this.all.length) {
        this.current = 0
      } else if (this.current < 0) {
        this.current = this.all.length -1
      }
      this.options.entityType = this.all[this.current]
      return false // no socket event
    }
}
