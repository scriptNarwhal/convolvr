export default class Cursor {
    constructor (data, user) {
      let mesh = null,
          color = 0xf0f0f0,
          light = false,
          geom = new THREE.CylinderGeometry(65, 65, 65, 4, 1, true),
          mat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            fog: false,

          })

      mesh = new THREE.Mesh(geom, mat)
      if (light) {
        mesh.add(light)
        light.position.set(0, 100, -100)
      }
      this.mesh = mesh
      mesh.position.set(0, 0, -14000)
      mesh.rotation.x = Math.PI / 2.0
      user && user.mesh.add(mesh)
    }

    hide () {
      this.mesh.visible = false
    }
    show () {
      this.mesh.visible = true
    }
    activate () {
      this.mesh.scale.set(3.0, 3.0, 3.0)
    }
    deactivate () {
      this.mesh.scale.set(1.0, 1.0, 1.0)
    }
}
