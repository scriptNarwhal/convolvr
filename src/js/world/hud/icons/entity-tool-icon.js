import Icon from './icon'

export default class EntityToolIcon extends Icon {
    constructor (data) {
        this.mesh = null;
        this.name = "Entity Tool";

    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0x404040,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 200) : false,
          geom = THREE.BoxGeometry(132, 132, 132),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

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
