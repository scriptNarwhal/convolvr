import Tool from './tool'
import EntityGenerator from '../entities/entity-generator'
/* terrain voxel tool */
export default class VoxelTool extends Tool {
    constructor (data, world) {
      this.data = data;
      this.world = world;
      this.mesh = null;
      this.name = "Voxel Tool"
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
      mesh.rotation.x = Math.PI / 2.0
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
        color: 0xff8707,
        text: "",
        quaternion: null
      })
      return entity
    }

    primaryAction () {
      // create voxel
    }

    secondaryAction () {
      // remove voxel
    }
}
