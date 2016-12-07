import CustomToolIcon from '../hud/icons/custom-tool-icon'

export default class CustomTool {
    constructor (data, user) {
      this.data = data;
      this.user = user;
      this.mesh = null;
      this.name = data ? data.name : "New Custom Tool";
      this.icon = new CustomToolIcon();
    }

    initMesh (data = {}) {
      let mesh = null,
          color = data.color || 0xffffff,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 200) : false,
          geom = new THREE.BoxGeometry(200, 1000, 100),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = new THREE.Mesh(geom, mat);
      if (light) {
        mesh.add(light);
        light.position.set(0, 100, -100);
      }
      this.mesh = mesh;
      return this.mesh;
    }

    primaryAction () {

    }

    secondaryAction () {

    }

    equip (hand) {
      if (this.mesh == null) {
        three.camera.add(this.initMesh(this.data))
        // add to respective hand (when implemented)
      } else {
        this.mesh.visible = true;
      }
    }

    unequip (hand) {
      if (this.mesh != null) {
        this.mesh.visible = false;
      }
    }
}
