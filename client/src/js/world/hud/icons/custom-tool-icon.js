import Icon from './icon'

export default class CustomToolIcon extends Icon {
    constructor (data) {
        this.mesh = null;
        this.name = "Custom Tool";

    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0xffff07,
          light = data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 1200) : false,
          geom = new THREE.CylinderGeometry(132, 132, 132, 6, 1),
          mat = new THREE.MeshBasicMaterial({color: color, wireframe: true, fog: false});

      mesh = new THREE.Mesh(geom, mat);
      if (light) {
        mesh.add(light);
        light.position.set(0, 100, -100);
      }
      this.mesh = mesh;
      return mesh;
    }

    onActivate () {

    }
}
