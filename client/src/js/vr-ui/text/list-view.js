import Text from './text'

export default class ListView extends Text {
    constructor (data, mount) {
        this.mount = mount
        this.mesh = null
        this.id = data.id || "listview"+Date.now()
        this.color = data.color || "#ffffff"
        this.background = data.background || "#000000"
        this.lightColor = data.lightColor || 0xffffff
        this.textLines = data.textLines
        this.position = data.position || [0, 0, 0]
        this.quat = !!data.quaternion ? data.quaternion : false
    }

    initMesh () {
      let mesh = null,
          color = this.color,
          background = this.background,
          light =  this.lightColor ? new THREE.PointLight(this.lightColor, 0.666, 100000) : false,
          geom = new THREE.BoxGeometry(36000, 36000, 40),
          mat = this.renderTextLines(this.id, this.textLines, color, background)
      if (this.mesh == null) {
        mesh = new THREE.Mesh(geom, mat)
        if (light) {
          mesh.add(light)
          light.position.set(0, -10000, 0)
        }
        this.mesh = mesh
        this.mesh.position.set(this.position[0], this.position[1], this.position[2])
        if (this.quaternion) {
          this.mesh.quaternion.set(this.quat[0], this.quat[1], this.quat[2], this.quat[3])
        }
        this.mount.add(mesh)
      } else {
        this.mesh.material = mat
        this.mesh.material.needsUpdate = true
      }
      return this
    }

    update (data) {
      let x = null
      for (x in data) {
        this[x] = data[x]
      }
      this.initMesh()
      return this
    }

    write (text) {
      this.textLines.push(text)
      this.initMesh()
      return this
    }
}
