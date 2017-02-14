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
    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0xffffff,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 200) : false,
          geom = new THREE.BoxGeometry(200, 1000, 100),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = new THREE.Mesh(geom, mat);
      mesh.rotation.x = Math.PI / 2.0
      if (light) {
        mesh.add(light);
        light.position.set(0, 100, -100);
      }
      this.mesh = mesh;
      return this.mesh;
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
      let cursor = this.world.user.cursor,
          position = telemetry.position,
          selected = cursor.entity,
          entityId = -1,
          components = [],
          quat = three.camera.quaternion,  //[quat.x, quat.y, quat.z, quat.w],
          component = this.components.makeComponent(this.options.componentType),
          entity = new Entity(0, [component], [], [0, 0, 0], [quat.x, quat.y, quat.z, quat.w])
      //entity.init(three.scene)
      if (selected && cursor.distance < 33000) {
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

    secondaryAction (telemetry) {
      // cycle components
      this.current ++
      if (this.current >= this.all.length) {
        this.current = 0
      }
      this.options.componentType = this.all[this.current]
      return false // no socket event
    }
}
