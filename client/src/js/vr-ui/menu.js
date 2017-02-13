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
          light = new THREE.PointLight(this.lightColor, 1.0, 40000),
          geom = new THREE.BoxGeometry(100000, 20000, 4000),
          mat = new THREE.MeshPhongMaterial({color: color, fog: false})

      mesh = new THREE.Object3D() //THREE.Mesh(geom, mat);
      if (light) {
        this.light = light;
        mesh.add(light);
        light.position.set(0, 2000, 20000)
      }
      if (options.length > 0) {
        o = options.length -1;
        while (o >= 0) {
          let icon = null,
              curvature = 0 //-Math.sin(Math.PI*((o+1)/(options.length+1)))
          icon = options[o].icon
          icon.init(mesh)
          icon.update([-26000+o*13000, -2000, curvature*12000])
          o --;
        }
      }
      this.mesh = mesh
      this.parent = parent
      three.scene.add(mesh)
      mesh.position.set(0, 72000, -100000)
      this.label = new Label({
        text: "Hello World",
        color: 0x00ff00,
        lightColor: 0xffffff,
        position: [0, -15000, -5000]
      }, this.mesh)
      return this.mesh
    }

    update () {
      let toolbox = this.toolbox,
          index = toolbox.currentTools[0],
          label = toolbox.tools[index].name

      this.label.update({ color: '#ffffff', lightColor: 0xffffff, text: label })
      this.light.position.set(-16000+index*14000, -2000, 6000)
    }

    updatePosition () {
      let pPos = this.parent.position
      this.mesh.position.set( pPos.x, pPos.y, pPos.z )
      this.mesh.translateZ(-70000)
      this.mesh.translateY(30000)
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
