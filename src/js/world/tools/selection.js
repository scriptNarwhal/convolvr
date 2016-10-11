/* selection */
import Entity from './entity.js';

export default class Selection {
  constructor (position, quaternion) {
      this.position = position ? position : false;
      this.quaternion = quaternion ? quaternion : false;
      this.mesh = new THREE.Mesh( new THREE.CylinderGeometry( 10000, 10000, 1000, 6, 1),  new THREE.MeshBasicMaterial( {shading: THREE.FlatShading, color: 0xffffff, fog: false, wireframe: true} ));

      if (!! this.quaternion) {
          mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      }
      if (!! this.position) {
          mesh.position.set(position.x, position.y, position.z);
      }
      scene.add(mesh);
      this.mesh = mesh;
  }

  update (position, quaternion) {
      this.position = position ? position : false;
      this.quaternion = quaternion ? quaternion : false;
      if (!! this.quaternion) {
          this.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
      }
      if (!! this.position) {
          this.mesh.position.set(position.x, position.y, position.z);
      }
  }

  changeColor (color) {
      this.mesh.material.color.set(color);
      this.mesh.material.needsUpdate = true;
  }


}
