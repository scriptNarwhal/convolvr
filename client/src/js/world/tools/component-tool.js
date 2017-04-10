import Tool from './tool'
import Component from '../../components/component'
import Entity from '../../entities/entity'
import ComponentGenerator from '../../components/component-generator'
import EntityGenerator from '../../entities/entity-generator'

export default class ComponentTool extends Tool {
  constructor (data, world, toolbox) {
    super(data, world, toolbox)
        this.mesh = null;
        this.name = "Component Tool";
        this.icon = this.initIcon()
        this.entities = new EntityGenerator()
        this.components = new ComponentGenerator()
        this.options = {
          componentType: "panel"
        }
        this.all = ["panel", "block", "column", "wirebox"]
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
      this.entities = this.entities || new EntityGenerator()
      let entity = this.entities.makeEntity("icon", true)
      entity.components.push({
        props: {},
        shape: "box",
        size: [2640, 2640, 2640],
        position: [0, 0, 0],
        color: 0x003bff,
        text: "",
        quaternion: null
      })
      return entity
    }

    primaryAction (telemetry) { // place component (into entity if pointing at one)
      let cursor = telemetry.cursor,
          cursorState = cursor.state.cursor || {},
          position = telemetry.position,
          quat = telemetry.quaternion,
          selected = !!cursorState.entity ? cursorState.entity : false,
          entityId = -1,
          components = [],
          component = this.components.makeComponent(this.options.componentType),
          entity = new Entity(0, [component], [0, 0, 0], [quat.x, quat.y, quat.z, quat.w])
      //entity.init(three.scene)
      if (selected && cursorState.distance < 60000) {
          entityId = selected.id
          if (components.length == 0) {
            components = [component]
          }
          selected.mesh.updateMatrixWorld()
          let selectedPos = selected.mesh.localToWorld(new THREE.Vector3())
          // apply transformation and offset to components
          components.map((comp, i)=> {
            comp.position=[
              position[0] - selectedPos.x,
              position[1] - selectedPos.y,
              position[2] - selectedPos.z
            ]
            comp.quaternion = [quat.x, quat.y, quat.z, quat.w]
          })
          return {
            entity,
            entityId,
            components
          }
      } else {
        // switch back to entity tool, if the user is clicking into empty space
        this.world.user.toolbox.useTool(0, 0)
        this.world.user.hud.show()
        this.world.user.toolbox.usePrimary(0)
        return false
      }
    }

    secondaryAction (telemetry, value) {
      // cycle components
      this.current += value
      if (this.current >= this.all.length) {
        this.current = 0
      } else if (this.current < 0) {
        this.current = this.all.length - 1
      }
      this.options.componentType = this.all[this.current]
      return false // no socket event
    }
}
