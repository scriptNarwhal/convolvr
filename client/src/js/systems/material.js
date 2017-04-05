export default class MaterialSystem {
    constructor (world) {
        this.world = world
    }

    init (component) {
        let prop = component.props.material,
            mat = {},
            material = null,
            basic = false,
            mobile = this.world.mobile

          switch (prop.name) {
        case "wireframe":
          mat = {
            color: prop.color || 0x00ff00,
            wireframe: true,
            fog: false
          }
          basic = true
        break
        case "basic":
          mat = { color: 0x303030 }
          basic = true
        break
        default:
          mat = {
              color: prop.color || 0xff00ff,
              fog: false
          }
          basic = false
          break
        }
        if (basic) {
          material = new THREE.MeshBasicMaterial(mat)
        } else {
          if (mobile) {
            material = new THREE.MeshLambertMaterial(mat)
            } else {
              material = new THREE.MeshPhongMaterial(mat)
            }
          }
        component.material = material
        return {}
    }
}

         