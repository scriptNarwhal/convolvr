export default class HUDMenu {
    constructor (options = [], toolbox = false) {
      this.options = options;
      if (toolbox && options.length == 0) {
        this.options = toolbox.getTools();
      }
      this.toolbox = toolbox;
      this.lightColor = 0xffffff;
      this.light = null;
    }

    initMesh (data = {}, user) {
      let mesh = null,
          options = this.options,
          o = 0,
          color = data.color || 0xffffff,
          light = new THREE.PointLight(this.lightColor, 1.0, 2000),
          geom = new THREE.BoxGeometry(5000, 1000, 200),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = new THREE.Object3D() //THREE.Mesh(geom, mat);
      if (light) {
        this.light = light;
        mesh.add(light);
        light.position.set(0, 100, -300);
      }
      console.log(options);
      if (options.length > 0) {
        o = options.length -1;
        while (o >= 0) {
          let icon = options[o].icon.initMesh();
          icon.position.set(-1300+o*650, -100, 300);
          mesh.add(icon);
          o --;
        }
      }
      this.mesh = mesh;
      user.mesh.add(mesh);
      mesh.position.set(0, 3600, -5000);
      return this.mesh;
    }

    update () {
      let index = this.toolbox.getCurrentTool(0);
      this.light.position.set(-1200+index*600, -100, 300);
    }

    hide () {
      this.mesh.visible = false;
    }

    show () {
      this.mesh.visible = true;
    }

    toggleVRHUD() {
      if (this.mesh.position.y != 2200) {
        this.mesh.position.set(0, 2200, -5000);
      } else {
        this.mesh.position.set(0, 3600, -5000);
      }
    }
}
