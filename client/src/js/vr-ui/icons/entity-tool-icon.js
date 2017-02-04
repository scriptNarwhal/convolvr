import Icon from './icon'

export default class EntityToolIcon extends Icon {
    constructor (data) {
        this.mesh = null;
        this.name = "Entity Tool";

    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0x15ff15,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 2400) : false,
          geom = new THREE.BoxGeometry(264, 264, 264),
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
