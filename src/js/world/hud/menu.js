export default class HUDMenu {
    constructor (options = [], toolbox = false) {
      this.options = options;
      if (toolbox && options.length == 0) {
        this.options = toolbox.getTools();
      }
      this.toolbox = toolbox;
    }

    initMesh (data = {}) {
      let mesh = null,
          options = this.options,
          o = 0,
          color = data.color || 0xffffff,
          light =  data.lightColor ? new THREE.PointLight(data.lightColor, 1.0, 1000) : false,
          geom = new THREE.BoxGeometry(1000, 150, 75),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false, wireframe: true});

      mesh = new THREE.Mesh(geom, mat);
      if (light) {
        mesh.add(light);
        light.position.set(0, 100, -300);
      }

      if (options.length > 0) {
        while (o > 0) {
          icon = option.icon.initMesh();
          icon.position.set(o*150, 0, 0);
          this.mesh.add(icon);
        }
      }
      
      this.mesh = mesh;
      return this.mesh;
    }
}
