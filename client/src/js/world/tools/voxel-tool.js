import Tool from './tool'
import VoxelToolIcon from '../hud/icons/voxel-tool-icon'
/* terrain voxel tool */
export default class VoxelTool extends Tool {
    constructor (data, world) {
      this.data = data;
      this.world = world;
      this.mesh = null;
      this.name = "Voxel Tool"
      this.icon = new VoxelToolIcon();
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
      // create voxel
    }

    secondaryAction () {
      // remove voxel
    }
}
