import Icon from './icon'

export default class DeleteToolIcon extends Icon {
    constructor (data) {
        this.mesh = null;
        this.name = "Delete Tool";

    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0xff0707,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 2400) : false,
          geom = new THREE.BoxGeometry(132, 40, 40),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = this.initButtonMesh();
      mesh.add(new THREE.Mesh(geom, mat));
      if (light) {
        mesh.add(light);
        light.position.set(0, 200, -200);
      }
      this.mesh = mesh;
      return mesh;
    }

    onActivate () {

    }
}
