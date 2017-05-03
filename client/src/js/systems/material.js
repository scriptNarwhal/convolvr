export default class MaterialSystem {
    constructor (world) {
        this.world = world
        
    }

    init (component) {
        let props = component.props,
            prop = props.material,
            mat = { color: prop.color || 0xffffff },
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
          switch (prop.name) { // material presets
            case "wireframe":
              mat.wireframe = true
              mat.fog = false
              basic = true
            break
            case "basic": // mesh basic material
              basic = true
            break
            case "terrain":
              prop.diffuse = '/data/images/textures/gplaypattern_@2X.png'
              prop.repeat = ["wrap", 16, 16]
            break
            case "metal":
              prop.reflection = '/data/images/textures/sky-reflection.jpg'
              prop.specular = '/data/images/textures/gplaypattern_@2X.png'
            break
            case "glass":
             prop.reflection = '/data/images/textures/sky-reflection.jpg'
            break
            case "plastic":
              prop.specular = '/data/images/textures/gplaypattern_@2X.png'
            default:
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

          if (prop.diffuse) {
            assets.loadImage(prop.diffuse, (texture)=>{ 
              if (!!prop.repeat) {
                if (prop.repeat[0] == "wrapping") {
                  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			            texture.repeat.set(prop.repeat[1], prop.repeat[2])
                  texture.needsUpdate = true
                }
              }
              texture.anisotropy = three.renderer.getMaxAnisotropy()
              material.map = texture
              material.needsUpdate = true 
            })
          }
          if (prop.specular) {
            assets.loadImage(prop.specular, (texture)=>{ 
              texture.anisotropy = three.renderer.getMaxAnisotropy()
              material.specularMap = texture
              material.needsUpdate = true 
            })
          }
          if (prop.reflection) {
            assets.loadImage(prop.reflection, (texture)=>{ 
              texture.mapping = THREE.SphericalReflectionMapping
              material.envMap = texture
              material.needsUpdate = true 
            })
            
          }
          // if (map != undefined) {
          //   mat.map = map
          // }
          // if (specular != undefined) {
          //   mat.specular = specular
          // }
          // if (reflection != undefined) {
          //   reflection.mapping = THREE.SphericalReflectionMapping
          //   mat.envMap = reflection
          // }
          
          assets.materials[materialCode] = material // cache material for later
        } else {
          material = assets.materials[materialCode]
        }

      return {
          material
      }
    }
}

         