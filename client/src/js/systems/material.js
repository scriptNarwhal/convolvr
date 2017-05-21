export default class MaterialSystem {
    constructor ( world ) {
        this.world = world
        
    }

    init ( component ) {

        let props = component.props,
            prop = props.material,
            mat = { color: prop.color || 0xffffff },
            assets = this.world.systems.assets,
            mobile = this.world.mobile,
            path = '/data/images/',
            material = null,
            basic = false,
            textureConfig = { },
            diffuse = !!prop.diffuse ? prop.diffuse.replace(path, '') : "",
            specular = !!prop.specular ? prop.specular.replace(path, '') : "",
            reflection = !!prop.reflection ? prop.reflection.replace(path, '') : "",
            materialCode = `${prop.name}:${prop.color}:${diffuse}:${specular}:${reflection}`
            
        
        if ( assets.materials[materialCode] == null ) {

          switch ( prop.name ) { // material presets
              case "wireframe":
                  mat.wireframe = true
                  mat.fog = false
                  basic = true
              break
              case "basic": // mesh basic material
                  basic = true
              break
              case "terrain":
                  prop.diffuse = '/data/images/textures/shattered_@2X.png'
                  prop.specular = '/data/images/textures/gplaypattern_@2X.png'
                  prop.repeat = ["wrapping", 12, 12]
              break
              case "metal":
                  prop.reflection = '/data/images/textures/sky-reflection.jpg'
                  prop.specular = '/data/images/textures/gplaypattern_@2X.png'
                  prop.diffuse = '/data/images/textures/shattered_@2X.png'
              break
              case "glass":
                  prop.reflection = '/data/images/textures/sky-reflection.jpg'
                  prop.specular = '/data/images/textures/shattered_@2X.png'
              break
              case "plastic":
                  prop.diffuse = '/data/images/textures/gplaypattern_@2X.png'
                  prop.specular = '/data/images/textures/shattered_@2X.png'
              default:
              break
          }
         
          if ( basic ) {

            material = new THREE.MeshBasicMaterial(mat)

          } else {

            material = mobile ? new THREE.MeshLambertMaterial(mat) : new THREE.MeshPhongMaterial(mat)

          }

          if ( !!prop.repeat ) {

            textureConfig.repeat = prop.repeat

          }

          if ( prop.diffuse ) {

            assets.loadImage(prop.diffuse, textureConfig, (texture) => { 

              if (!!prop.repeat) {

                this._setTextureRepeat( texture, prop.repeat )

              }

              texture.anisotropy = three.renderer.getMaxAnisotropy()
              material.map = texture
              material.needsUpdate = true 

            })

          }

          if ( prop.specular ) {

            assets.loadImage(prop.specular, textureConfig, (texture)=>{ 
              texture.anisotropy = three.renderer.getMaxAnisotropy()
              material.specularMap = texture
              material.needsUpdate = true 
            })

          }

          if ( prop.reflection ) {

            assets.loadImage(prop.reflection, textureConfig, (texture)=>{ 
              texture.mapping = THREE.SphericalReflectionMapping
              material.envMap = texture
              material.needsUpdate = true 
            })
            
          }
          
          assets.materials[materialCode] = material // cache material for later

        } else {

          material = assets.materials[materialCode]

        }

      return {
          material
      }

    }

    _setTextureRepeat ( texture, repeat ) {

      if ( repeat[0] == "wrapping" ) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			      texture.repeat.set(repeat[1], repeat[2])
            texture.needsUpdate = true

      }

    }

    generateTexture ( params ) { // would be useful for tiling / random patterns

      let assets = this.world.systems.assets,
          textureCode = "implement:This", // serialize the parameters in some _fairly_ concise way to build this string
          texture = null // probably using size... and.. some data from the rendering
        
      if (assets.proceduralTextures[textureCode] == null) {
        // reference TextSystem for canvas code here..

      } else { // use cached version if available
        texture = assets.proceduralTextures[textureCode]
      }

      return texture

    }
}

         