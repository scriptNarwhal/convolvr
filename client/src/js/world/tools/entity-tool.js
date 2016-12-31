import Tool from './tool'
import Entity from '../entity'
import EntityToolIcon from '../hud/icons/entity-tool-icon'

export default class EntityTool extends Tool  {
    constructor (data, world) {
      this.data = data
      this.world = world
      this.mesh = null
      this.name = "Entity Tool"
      this.icon = new EntityToolIcon()
    }

    initMesh (data = {}) {
      let mesh = null,
          color = 0xffffff,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 200) : false,
          geom = new THREE.BoxGeometry(200, 1000, 100),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = new THREE.Mesh(geom, mat);
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
      // clone entity
    }
}
