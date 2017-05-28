export default class MaterialSystem {

    constructor ( world ) {

        this.world = world
        
    }

    init ( component ) {

        let props = component.props,
            prop = props.material,
            mat = { color: prop.color || 0xffffff },
            assets = this.world.systems.assets,
            materialSystem = this,
            mobile = this.world.mobile,
            path = '/data/images/',
            material = null,
            basic = false,
            textureConfig = { },
            diffuse = !!prop.map ? prop.map.replace(path, '') : "",
            specular = !!prop.specularMap ? prop.specularMap.replace(path, '') : "",
            reflection = !!prop.envMap ? prop.envMap.replace(path, '') : "",
            materialCode = `${prop.name}:${prop.color}:${diffuse}:${specular}:${reflection}`,
            shading = !!prop.shading ? prop.shading : 'default',
            renderer = three.renderer

        if ( assets.materials[materialCode] == null ) {

          if ( !! prop.config ) { // raw, three.js material properties, to override things

            mat = Object.assign({}, mat, prop.config)

          }
         
          if ( !!prop.repeat ) {

            textureConfig.repeat = prop.repeat

          }

          basic = this._initMaterialProp( prop )

          let envMapUrl = !! prop.envMap ? prop.envMap : assets.envMaps.default

          if ( envMapUrl && envMapUrl != "none" && prop.roughnessMap || shading == 'physical' ) {

            shading = 'physical'

            assets.loadImage( envMapUrl, textureConfig, ( envMap ) => { 

              envMap.mapping = THREE.SphericalReflectionMapping
              mat.envMap = envMap

              assets.loadImage( prop.roughnessMap, textureConfig, ( roughnessMap ) => {

                !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                roughnessMap.anisotropy = renderer.getMaxAnisotropy()
                mat.roughnessMap = roughnessMap
                
                let roughnessCallback = ( roughnessMap ) => { 

                    !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                    roughnessMap.anisotropy = renderer.getMaxAnisotropy()
                    mat.roughnessMap = roughnessMap
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapCallback = ( map ) => { 

                    !!prop.repeat && this._setTextureRepeat( map, prop.repeat )
                    map.anisotropy = renderer.getMaxAnisotropy()
                    mat.map = map
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapAndRoughnessCallback = ( map ) => {

                    !!prop.repeat && this._setTextureRepeat( map, prop.repeat )
                    map.anisotropy = renderer.getMaxAnisotropy()
                    mat.map = map
                    
                    assets.loadImage( prop.roughnessMap, textureConfig, roughnessCallback )

                  }

                if ( prop.roughnessMap && !!! prop.map ) { //console.log("**** roughnessMap but no map")
                  
                  assets.loadImage( prop.roughnessMap, textureConfig, roughnessCallback )

                } else if ( prop.map && prop.roughnessMap ) { //console.log("**** roughnessMap AND map")
                  
                  assets.loadImage( prop.map, textureConfig, mapAndRoughnessCallback )

                } else if ( !!! prop.roughnessMap && prop.map ) { //console.log("**** NO roughnessMap. map, however")
                  
                  assets.loadImage( prop.map, textureConfig, mapCallback )

                } else { //console.log("**** No metalness. No map.")
                  
                  material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                }

                assets.materials[ materialCode ] = material // cache material for later

              })

            })
            
          } else {

            shading = 'phong'
            material = this._initMaterial( prop, mat, shading, basic, mobile )

            if ( prop.specular ) {

              assets.loadImage( prop.specular, textureConfig, ( specularMap )=>{ 

                specularMap.anisotropy = renderer.getMaxAnisotropy()
                material.specularMap = specularMap
                material.needsUpdate = true 

              })

            }

            !!prop.map && assets.loadImage( prop.map, textureConfig, (texture) => { 

              if ( !!prop.repeat ) {

                this._setTextureRepeat( texture, prop.repeat )

              }

              texture.anisotropy = renderer.getMaxAnisotropy()
              material.map = texture
              material.needsUpdate = true 

            })

            assets.materials[ materialCode ] = material // cache material for later

          }        

        } else {

          material = assets.materials[materialCode]

        }

      return {
          material
      }

    }

    _initMaterial( prop, config, shading, basic, mobile ) {

      let material = null

      this._initMaterialConfig( prop, config, shading, basic, mobile)

      if ( basic ) {

          material = new THREE.MeshBasicMaterial( config )

        } else if ( shading == 'physical' ) { // breaks when specular map hasn't loaded yet

            material = new THREE.MeshPhysicalMaterial( config )

        } else {

            material = mobile ? new THREE.MeshLambertMaterial( config ) : new THREE.MeshPhongMaterial( config )

        }

        return material

    }

    _initMaterialConfig ( prop, mat, shading, basic, mobile  ) {

      switch ( prop.name ) { // material presets

              case "wireframe":
                  mat.wireframe = true
                  mat.fog = false
                  
              break
              case "basic": // mesh basic material
                  
              break
              case "terrain":
                if (shading != 'physical') {
                  
                  mat.specular = 0xffffff
                  mat.shininess = 2.0

                }
              break
              case "metal":
                if ( shading == 'physical' ) {

                  mat.metalness = 1.0

                } else {

                  mat.specular = 0xffffff
                  mat.shininess = 7.4

                }
              break
              case "glass":
                if ( shading == 'physical' ) {

                  mat.metalness = 1.0

                } else {

                  mat.specular = 0xffffff
                  mat.shininess = 9.4

                }
              break
              case "plastic":
                if (shading == 'physical') {

                  mat.metalness = 0.5

                } else {

                  mat.specular = 0x202020
                  mat.shininess = 4.0

                }
              default:
              break

          }

    }

    _initMaterialProp ( prop ) {

      let basic = false

      switch ( prop.name ) { // material presets

            case "wireframe":
                basic = true
            break
            case "basic": // mesh basic material
                basic = true
            break
            case "terrain":
                prop.map = '/data/images/textures/shattered_@2X.png'
                prop.specularMap = '/data/images/textures/gplaypattern_@2X.png'
                prop.envMap = 'none'
                prop.repeat = [ 'wrapping', 12, 12 ]
            break
            case "metal":
                //prop.envMap = '/data/images/textures/sky-reflection.jpg'
                prop.repeat = [ 'wrapping', 3, 3 ]
                prop.roughnessMap = '/data/images/textures/gplaypattern_@2X.png'
                prop.map = '/data/images/textures/shattered_@2X.png'
            break
            case "glass":
                //prop.reflection = '/data/images/textures/sky-reflection.jpg'
                prop.roughnessMap = '/data/images/textures/shattered_@2X.png'
                //shading = 'physical'
            break
            case "plastic":
                prop.repeat = [ 'wrapping', 2, 2 ]
                prop.map = '/data/images/textures/gplaypattern_@2X.png'
                //prop.specularMap = '/data/images/textures/gplaypattern_@2X.png'
                prop.roughnessMap = '/data/images/textures/shattered_@2X.png'
            default:
            break

          }

          return basic

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
        
      if (assets.proceduralTextures[textureCode] == null) {  // reference TextSystem for canvas code here..
       
      } else { // use cached version if available

        texture = assets.proceduralTextures[textureCode]

      }

      return texture

    }
}

         