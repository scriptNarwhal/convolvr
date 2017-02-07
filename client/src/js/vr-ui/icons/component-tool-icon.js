import Icon from './icon'

export default class ComponentToolIcon extends Icon {
    constructor (data) {
        this.mesh = null;
        this.name = "Component Tool";

    }

    initMesh (data = {}) {
      let mesh = null,
          part = null,
          color = data.color || 0x003bff,
          light = data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 24000) : false,
          geom = new THREE.CylinderGeometry(2640, 2640, 2640, 6, 1),
          geomB = new THREE.BoxGeometry(400, 400, 400),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = this.initButtonMesh();
      mesh.add(new THREE.Mesh(geom, mat));
      //part = new THREE.Mesh(geomB, mat);
      //mesh.add(part);

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
