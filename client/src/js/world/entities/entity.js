import Component from '../components/component.js';

export default class Entity {
  constructor (id, components, aspects = [], position, quaternion, z) {
      this.id = id;
      this.components = components;
      this.position = position ? position : false;
      this.quaternion = quaternion ? quaternion : false;
      this.z = z //translateZ
      this.mesh = null;
  }

  init (scene) {
    var mesh = new THREE.Object3D(),
        aspects = this.aspects,
        ncomps = this.components.length,
        comp = null,
        c = 0;

    while (c < ncomps) {
        comp = new Component(this.components[c]);
        mesh.add(comp.mesh);
        c ++;
    }
    if (!! this.quaternion) {
        mesh.quaternion.set(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w);
    }
    if (!! this.position) {
        mesh.position.set(this.position.x, this.position.y, this.position.z);
    }
    scene.add(mesh);
    this.z > 0 && mesh.translateZ(this.z)
    this.mesh = mesh;
    if (!!aspects) {
        c = 0;
        while (c < aspects.length) {
            // connect entity to appropriate system
            c ++
        }
    }
  }

}
