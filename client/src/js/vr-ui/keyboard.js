import Entity from '../entities/entity'

export default class Keyboard {
    constructor (data, mount) {
      let color = 0xe5e5e5,
          light = false,
          distance = 12000,
          entity = new Entity(0, [{
              type: 'structure',
              shape: 'box',
              color: 0xf0f0f0,
              size: [80, 80, 80],
              material: "wireframe",
              props: {
                noRaycast: true
              }
          }], [0, 0, -distance], null, 0).init(mount)
      this.keys = [["1234567890"],
                   ["QWERTYUIOP"],
                    ["ASDFGHJKL"],
                     ["ZXCVBNM"]]
      this.mesh = entity.mesh
      this.entity = null
      this.distance = distance
      this.point = new THREE.Vector3()
      if (light) {
        this.mesh.add(light)
        light.position.set(0, 100, -100)
      }
      this.mesh.rotation.x = Math.PI / 2.0
    }
    initMesh (data = {}, parent) {
      let mesh = null,
          label = null,
          options = this.keys,
          x = 0,
          y = 0,
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
        x = options.length -1;
        while (x >= 0) {
          y = this.keys[x].length -1
          while (y >= 0) {
            let icon = null,
                curvature = 0 //-Math.sin(Math.PI*((o+1)/(options.length+1)))
              label = new Label({
                  text: this.keys[x][y],
                  color: 0x00ff00,
                  lightColor: 0xffffff,
                  position: [0, -15000, -5000]
                }, this.mesh)
            label.update([-26000+x*13000, -26000+y*13000, -26000+y*13000])
            y --
          }
          x --
        }
      }
      this.mesh = mesh
      this.parent = parent
      three.scene.add(mesh)
      mesh.position.set(0, 72000, -100000)

      return this.mesh
    }
    hide () {
      this.mesh.visible = false
    }
    show () {
      this.mesh.visible = true
    }
    keyPress (key) {

    }
    update (position, quaternion, translateZ) {
        this.position = position ? position : false;
        this.quaternion = quaternion ? quaternion : false;
        if (quaternion) {
            this.mesh.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
        }
        if (position) {
            this.mesh.position.set(position.x, position.y, position.z);
        }
        if (translateZ) {
          this.mesh.translateZ(translateZ)
        }
    }
    color (color) {
        this.mesh.material.color.set(color);
        this.mesh.material.needsUpdate = true;
    }
}
