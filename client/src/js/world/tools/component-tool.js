import Tool from './tool'
import Component from '../components/component'
import Entity from '../entities/entity'
import ComponentToolIcon from '../../vr-ui/icons/component-tool-icon'
import ComponentGenerator from '../components/component-generator'
import EntityGenerator from '../entities/entity-generator'

export default class ComponentTool extends Tool {
    constructor (data, world) {
        this.data = data;
        this.world = world;
        this.mesh = null;
        this.name = "Component Tool";
        this.icon = new ComponentToolIcon()
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

    primaryAction () {
      // place component (into entity if pointing at one)
      let cursor = this.world.user.cursor,
          quat = three.camera.quaternion,
          selected = cursor.entity,
          entityId = -1,
          components = [],
          component = this.components.makeComponent(this.options.componentType),
          entity = new Entity(0, [component], [], [0, 0, 0], [quat[0], quat[1], quat[2], quat[3]])
      //entity.init(three.scene)
      // create / add mesh to scene here, but don't send with ```entity```
      if (selected) {
        if (cursor.distance < 33000) {
          entityId = selected.id
          if (components.length == 0) {
            components = entity.components
          }
          let selectedPos = selected.mesh.position

          components.map((comp)=> {
            // apply transformation and offset
          })
        }
        console.log(selected.id)
        console.log("ADDING COMPONENTS TO ENTITY")
      }
      return {
        entity,
        entityId,
        components
      }
    }

    secondaryAction () {
      // cycle components
      this.current ++
      if (this.current >= this.all.length) {
        this.current = 0
      }
      this.options.entityType = this.all[this.current]
      return false // no socket event
    }
}
