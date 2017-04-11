export default class MaterialSystem {
    constructor (world) {
        this.world = world
    }

    init (component) {
        let props = component.props,
            prop = props.material,
            mat = {},
            material = null,
            basic = false,
            mobile = this.world.mobile,
            map = undefined

        if (props.assets != null) {
          map = this.asset.load(props.assets[0])
        }
          switch (prop.name) {
        case "plastic":
          mat = { color: prop.color || 0xffffff }
        break
        case "metal":
          mat = { color: prop.color || 0xffffff }
        break
        case "glass":
          mat = { color: prop.color || 0xffffff }
        break
        case "wireframe":
          mat = {
            color: prop.color || 0x00ff00,
            wireframe: true,
            fog: false
          }
          basic = true
        break
        case "basic":
          mat = { color: prop.color || 0xffffff }
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
        if (map != undefined) {
          mat.map = map
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
        return {
          
        }
    }
}

         