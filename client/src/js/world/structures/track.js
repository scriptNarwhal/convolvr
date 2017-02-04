import Structure from './Structure'

export default class Track extends Structure {
  constructor (data) {
      var mesh = new THREE.Object3D();
      super(data)
      this.data = data;
      this.mesh = mesh;
  }
}
