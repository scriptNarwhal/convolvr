import Tool from './tool'
import Component from '../components/component'
import ComponentToolIcon from '../hud/icons/component-tool-icon'
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
          translateZ: -14000,
          entityType: "panel"
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
      // place component
      // ray cast, find entity, else, make new one
      // implement ray cast *** ... world.raycast() ?

      let entity = this.entities.makeEntity(this.options.entityType)
      entity.translateZ = this.options.translateZ
      return entity
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

    equip (hand) {
      if (this.mesh == null) {
        let toolMesh = this.initMesh(this.data)
        this.world.user.mesh.add(toolMesh)
        toolMesh.position.set(1500-(2500*hand), -250, -1350)
        // add to respective hand (when implemented)
      } else {
        this.mesh.visible = true;
      }
    }

    unequip (hand) {
      if (this.mesh != null) {
        this.mesh.visible = false;
      }
    }
}
