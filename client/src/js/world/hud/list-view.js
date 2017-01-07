import Text from './text'

export default class ListView extends Text {
    constructor (data, mount) {
        this.mount = mount
        this.mesh = null
        this.id = data.id || "listview"+Date.now()
        this.color = data.color || 0xffffff
        this.lightColor = data.lightColor || 0xffffff
        this.textLines = data.textLines
    }

    initMesh () {
      let mesh = null,
          color = this.color,
          light =  this.lightColor ? new THREE.PointLight(this.lightColor, 1.0, 200) : false,
          geom = new THREE.BoxGeometry(3600, 3600, 40),
          mat = this.renderTextLines(this.id, this.textLines, color, "#000000")
      if (this.mesh == null) {
        mesh = new THREE.Mesh(geom, mat)
        if (light) {
          mesh.add(light)
          light.position.set(0, 100, -100)
        }
        this.mesh = mesh
        this.mesh.position.set(0, -600, 0)
        this.mount.add(mesh)
      } else {
        this.mesh.material = mat
        this.mesh.material.needsUpdate = true
      }
    }

    update (data) {
      this.textLines = data.textLines
      this.color = data.color
      this.lightColor = data.lightColor
      this.initMesh()
    }
}
