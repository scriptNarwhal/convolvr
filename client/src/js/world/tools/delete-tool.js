import Tool from './tool'
import DeleteToolIcon from '../../vr-ui/icons/delete-tool-icon'
/* delete (voxel | component | entity) tool */
export default class DeleteTool extends Tool  {
    constructor (data, world) {
      this.data = data;
      this.world = world;
      this.mesh = null;
      this.name = "Delete Tool";
      this.icon = new DeleteToolIcon();
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

    primaryAction () {
      // remove entity
    }

    secondaryAction () {
      //
    }
}
