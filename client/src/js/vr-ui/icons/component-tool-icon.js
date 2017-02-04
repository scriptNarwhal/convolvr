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
          light = data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 2400) : false,
          geom = new THREE.CylinderGeometry(264, 264, 264, 6, 1),
          geomB = new THREE.BoxGeometry(40, 40, 40),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = this.initButtonMesh();
      mesh.add(new THREE.Mesh(geom, mat));
      //part = new THREE.Mesh(geomB, mat);
      //mesh.add(part);

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
