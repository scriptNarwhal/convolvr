import Tool from './tool'
import Entity from '../entities/entity'
import EntityToolIcon from '../../vr-ui/icons/entity-tool-icon'
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
        entityType: "panel"
      }
      this.all = ["panel", "panel2", "panel3", "block", "column", "wirebox"]
      this.current = 0
    }

    initMesh (data = {}) {
      let mesh = null,
          color = 0xffffff,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 200) : false,
          geom = new THREE.BoxGeometry(200, 1000, 100),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false})

      mesh = new THREE.Mesh(geom, mat)
      mesh.rotation.x = Math.PI / 2.0
      if (light) {
        mesh.add(light)
        light.position.set(0, 100, -100)
      }
      this.mesh = mesh
      return this.mesh
    }

    primaryAction () { // place entity
      let cursor = this.world.user.cursor,
          selected = cursor.entity,
          entity = this.generator.makeEntity(this.options.entityType)
      if (selected && cursor.distance < 33000) {
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
