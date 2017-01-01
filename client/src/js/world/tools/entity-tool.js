import Tool from './tool'
import Entity from '../entities/entity'
import EntityToolIcon from '../hud/icons/entity-tool-icon'

export default class EntityTool extends Tool  {
    constructor (data, world) {
      this.data = data
      this.world = world
      this.mesh = null
      this.name = "Entity Tool"
      this.icon = new EntityToolIcon()
      this.options = {
        entityType: "panel",
        all: ["panel", "block", "column"],
        current: 0
      }
    }

    initMesh (data = {}) {
      let mesh = null,
          color = 0xffffff,
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
      // place entity
    }

    secondaryAction () {
      // cycle entities
      this.options.current ++
      if (this.options.current >= this.options.all.length) {
        this.options.current = 0
      }
      this.options.entityType = this.options.all[this.options.current]
      return false // no socket event
    }
}
