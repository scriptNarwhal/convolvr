import Icon from './icon'

export default class EntityToolIcon extends Icon {
    constructor (data) {
        this.mesh = null;
        this.name = "Entity Tool";

    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0x15ff15,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 24000) : false,
          geom = new THREE.BoxGeometry(2640, 2640, 2640),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = this.initButtonMesh();
      mesh.add(new THREE.Mesh(geom, mat));
      if (light) {
        mesh.add(light);
        light.position.set(0, 2000, -2000);
      }
      this.mesh = mesh;
      return mesh;
    }

    onActivate () {

    }
}
