import Tool from './tool'
import EntityGenerator from '../entities/entity-generator'

export default class CustomTool extends Tool {
    constructor (data, world) {
      this.data = data
      this.world = world
      this.mesh = null
      this.name = data ? data.name : "New Custom Tool"
      this.generator = this.generator || new EntityGenerator()
      this.icon = this.initIcon()
      this.options = {

      }
    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0xffffff,
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

    initIcon () {
      let entity = null
      this.generator = this.generator || new EntityGenerator()
      entity = this.generator.makeEntity("icon", true)
      entity.components.push({
        props: {},
        shape: "box",
        size: [2640, 2640, 2640],
        position: [0, 0, 0],
        color: 0xffffff,
        text: "",
        quaternion: null
      })
      return entity
    }

    primaryAction () {

    }

    secondaryAction () {

    }

}
