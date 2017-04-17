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
            map = undefined,
            specular = undefined,
            reflective = undefined,
            assets = this.world.systems.assets,
            diffuse = prop.diffuse,
            reflection = prop.reflection,
            materialCode = prop.name+":"+prop.color
        
        if (assets.materials[materialCode] == null) {
          switch (prop.name) {
            case "wireframe":
              mat = {
                color: prop.color || 0x00ff00,
                wireframe: true,
                fog: false
              }
              basic = true
            break
            case "basic": // mesh basic material
              mat = { color: prop.color || 0xffffff }
              basic = true
            break
            case "metal":
              mat = { color: prop.color || 0xffffff }
            break
            case "glass":
              mat = { color: prop.color || 0xffffff }
            break
            case "plastic":
            default:
              mat = {
                  color: prop.color || 0xff00ff,
                  fog: false
              }
            break
          }
          // set prop.foo* from prop.name.. for predefined textures
          if (prop.diffuse) {
            map = assets.loadImage(prop.diffuse)
          }
          if (prop.specular) {
            specular = assets.loadImage(prop.specular)
          }
          if (prop.reflection) {
            reflection = assets.loadImage(prop.reflection)
          }
          if (map != undefined) {
            mat.map = map
          }
          if (specular != undefined) {
            mat.specular = specular
          }
          if (reflection != undefined) {
            reflection.mapping = THREE.SphericalReflectionMapping
            mat.envMap = reflection
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
          assets.materials[materialCode] = material // cache material for later
        } else {
          material = assets.materials[materialCode]
        }

      return {
          material
      }
    }
}

         