export default class Cursor {
    constructor (data, user) {
      let mesh = null,
          color = 0xffffff,
          light = false,
          geom = new THREE.CylinderGeometry(250, 250, 250, 4, 1, true),
          mat = new THREE.MeshBasicMaterial({color: color,
                                            wireframe: true,
                                            fog: false})

      mesh = new THREE.Mesh(geom, mat)
      if (light) {
        mesh.add(light)
        light.position.set(0, 100, -100)
      }
      this.mesh = mesh
      mesh.position.set(0, 0, -12000)
      //mesh.rotation.y = Math.PI / 4.0
      mesh.rotation.x = Math.PI / 2.0
      //mesh.rotation.z = Math.PI / 4.0
      user && user.mesh.add(mesh)
    }

    hide () {
      this.mesh.visible = false
    }

    show () {
      this.mesh.visible = true
    }
}
