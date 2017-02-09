import Entity from '../world/entities/entity'

export default class Cursor {
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
          }], ["no-raycast"], [0, 0, -distance], null, 0).init(mount)

      this.mesh = entity.mesh
      this.entity = null
      this.distance = distance
      if (light) {
        this.mesh.add(light)
        light.position.set(0, 100, -100)
      }
      this.mesh.rotation.x = Math.PI / 2.0
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
      this.entity = false
      this.mesh.scale.set(1.0, 1.0, 1.0)
    }
    setEntity (e, dist) {
      //console.log(e) // remove this
      this.entity = e
      this.distance = dist
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
