export default class Cursor {
    constructor (data, user) {
      let mesh = null,
          color = 0xffffff,
          light = false,
          geom = new THREE.BoxGeometry(250, 250, 350),
          mat = new THREE.MeshBasicMaterial({color: color,
                                            wireframe: true,
                                            fog: false});

      mesh = new THREE.Mesh(geom, mat);
      if (light) {
        mesh.add(light);
        light.position.set(0, 100, -100);
      }
      this.mesh = mesh;
      mesh.position.set(0, 0, -12000);
      mesh.rotation.z = Math.PI / 4.0
      user && user.mesh.add(mesh);
    }

    hide () {
      this.mesh.visible = false;
    }

    show () {
      this.mesh.visible = true;
    }
}
