import Label from './text/label'

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

    initMesh (data = {}, parent) {
      let mesh = null,
          label = null,
          options = this.options,
          o = 0,
          color = data.color || 0xffffff,
          light = new THREE.PointLight(this.lightColor, 1.0, 4000),
          geom = new THREE.BoxGeometry(10000, 2000, 400),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false});

      mesh = new THREE.Object3D() //THREE.Mesh(geom, mat);
      if (light) {
        this.light = light;
        mesh.add(light);
        light.position.set(0, 200, -2000);
      }
      if (options.length > 0) {
        o = options.length -1;
        while (o >= 0) {
          let icon = options[o].icon.initMesh();
          icon.position.set(-2600+o*1300, -200, 600);
          mesh.add(icon);
          o --;
        }
      }
      this.mesh = mesh
      this.parent = parent
      three.scene.add(mesh)
      mesh.position.set(0, 7200, -10000)
      this.label = new Label({
        text: "Hello World",
        color: 0x00ff00,
        lightColor: 0xffffff,
        position: [0, -1200, 0]
      }, this.mesh)
      return this.mesh
    }

    update () {
      let toolbox = this.toolbox,
          index = toolbox.currentTools[0],
          label = toolbox.tools[index].name

      this.label.update({ color: '#ffffff', lightColor: 0xffffff, text: label })
      this.light.position.set(-1200+index*600, -200, 600)
    }

    updatePosition () {
      let pPos = this.parent.position
      this.mesh.position.set( pPos.x, pPos.y, pPos.z )
      this.mesh.translateZ(-10000)
      this.mesh.translateY(3000)
      this.mesh.rotation.y = this.parent.rotation.y
      this.update()
    }

    hide () {
      this.mesh.visible = false;
    }

    show () {
      this.mesh.visible = true;
      this.updatePosition()
    }
}
