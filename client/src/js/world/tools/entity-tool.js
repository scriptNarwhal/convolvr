import Tool from './tool'
import Entity from '../entities/entity'
import EntityToolIcon from '../hud/icons/entity-tool-icon'
import EntityGenerator from '../entities/entity-generator'

export default class EntityTool extends Tool  {
    constructor (data, world) {
      this.data = data
      this.world = world
      this.mesh = null
      this.name = "Entity Tool"
      this.icon = new EntityToolIcon()
      this.generator = new EntityGenerator()
      this.options = {
        translateZ: -9500,
        entityType: "panel"
      }
      this.all = ["panel", "block", "column", "wirebox"]
      this.current = 0
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
      let entity = this.generator.makeEntity(this.options.entityType)
      entity.translateZ = this.options.translateZ
      return entity
    }

    secondaryAction () {
      // cycle entities
      this.current ++
      if (this.current >= this.all.length) {
        this.current = 0
      }
      this.options.entityType = this.all[this.current]
      return false // no socket event
    }
}
