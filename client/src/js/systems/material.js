export default class MaterialSystem {

    constructor ( world ) {

        this.world = world
        
    }

    init ( component ) {

        let materialSystem = this,
            mobile = this.world.mobile,
            props = component.props,
            prop = props.material,
            mat = { color: prop.color || 0xffffff },
            assets = this.world.systems.assets,
            renderer = three.renderer,
            anisotropy = renderer.getMaxAnisotropy() / ( mobile ? 2 : 1 ),
            path = '/data',
            material = null,
            basic = false,
            textureConfig = { },
            diffuse = !!prop.map ? prop.map.replace(path, '') : "",
            specular = !!prop.specularMap ? prop.specularMap.replace(path, '') : "",
            envMapUrl = !! prop.envMap ? prop.envMap : assets.envMaps.default,
            reflection = !!envMapUrl ? envMapUrl.replace(path, '') : "",
            materialCode = `${prop.name}:${prop.color}:${diffuse}:${specular}:${reflection}`,
            shading = !!prop.shading ? prop.shading : 'default',
            simpleShading = this.world.lighting != 'high'
            

        if ( assets.materials[ materialCode ] == null ) {

          if ( !! prop.config ) { // raw, three.js material properties, to override things

            mat = Object.assign({}, mat, prop.config)

          }
         
          if ( !!prop.repeat ) {

            textureConfig.repeat = prop.repeat

          }

          basic = this._initMaterialProp( prop, simpleShading )

          if ( envMapUrl && envMapUrl != "none" && prop.roughnessMap || shading == 'physical' ) {

            shading = 'physical'

            assets.loadImage( envMapUrl, textureConfig, ( envMap ) => { 

              envMap.mapping = THREE.SphericalReflectionMapping
              mat.envMap = envMap

              assets.loadImage( prop.roughnessMap, textureConfig, ( roughnessMap ) => {

                !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                roughnessMap.anisotropy = renderer.getMaxAnisotropy()
                mat.roughnessMap = roughnessMap
                
                let roughnessCallback = roughnessMap => { 

                    !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                    roughnessMap.anisotropy = anisotropy
                    mat.roughnessMap = roughnessMap
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapCallback = diffuse => { 

                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapAndRoughnessCallback = diffuse => {

                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( prop.roughnessMap, textureConfig, roughnessCallback )

                  },
                  metalnessCallback = metalnessMap => {

                    !!prop.repeat && this._setTextureRepeat( metalnessMap, prop.repeat )
                    metalnessMap.anisotropy = renderer.getMaxAnisotropy() / 2.0 
                    mat.metalnessMap = metalnessMap
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapAndMetalnessCallback = diffuse => {

                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( prop.roughnessMap, textureConfig, metalnessCallback )

                  },
                  metalnessAndRoughnessCallBack = roughnessMap => {

                    !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                    roughnessMap.anisotropy = renderer.getMaxAnisotropy() / 2.0
                    mat.roughnessMap = roughnessMap
                    assets.loadImage( prop.roughnessMap, textureConfig, metalnessCallback )

                  },
                  mapMetalnessAndRoughnessCallback = tex => {
                    
                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( prop.roughnessMap, textureConfig, metalnessAndRoughnessCallBack )

                  }

                if ( prop.roughnessMap && !!! prop.map ) { //console.log("**** roughnessMap but no map")
                  
                  assets.loadImage( prop.roughnessMap, textureConfig, roughnessCallback )

                } else if ( prop.roughnessMap && prop.metalnessMap && !!! prop.map ) {
                
                  assets.loadImage( prop.roughnessMap, textureConfig, metalnessAndRoughnessCallBack )

                } else if ( prop.map && prop.roughnessMap ) { //console.log("**** roughnessMap AND map")
                  
                  assets.loadImage( prop.map, textureConfig, mapAndRoughnessCallback )

                } else if ( !!! prop.roughnessMap && prop.map ) { //console.log("**** NO roughnessMap. map, however")
                  
                  assets.loadImage( prop.map, textureConfig, mapCallback )

                } else if ( !!!prop.roughnessMap && prop.map && prop.metalnessMap ) {

                  assets.loadImage( prop.map, textureConfig, mapAndMetalnessCallback )

                } else if ( prop.roughnessMap && prop.map && prop.metalnessMap ) {

                  assets.loadImage( prop.map, textureConfig, mapMetalnessAndRoughnessCallback )

                } else { //console.log("**** No metalness. No map.")
                  
                  material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                }

                assets.materials[ materialCode ] = material // cache material for later

              })

            })
            
          } else {

            shading = 'phong'
            material = this._initMaterial( prop, mat, shading, basic, mobile )

            prop.specularMap && assets.loadImage( prop.specularMap, textureConfig, specularMap => { 

                  specularMap.anisotropy = renderer.getMaxAnisotropy()
                  material.specularMap = specularMap
                  material.needsUpdate = true 

            })

            !!prop.map && assets.loadImage( prop.map, textureConfig, texture => { 

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

          material = assets.materials[ materialCode ]

        }

      return {
          material,
          materialCode
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
                if ( shading != 'physical' ) {
                  
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

                  mat.metalness = 0.75

                } else {

                  mat.specular = 0xffffff
                  mat.shininess = 2.0

                }
              default:
              break

          }

    }

    _initMaterialProp ( prop, simpleShading ) {

      let basic = false

      switch ( prop.name ) { // material presets

            case "wireframe":
                basic = true
            break
            case "basic": // mesh basic material
                basic = true
            break
            case "terrain":
            
            if ( !simpleShading ) {

              prop.metalnessMap = "/data/images/textures/tiles.png" 
              prop.roughnessMap = '/data/images/textures/tiles.png'
              prop.map = !!!prop.map ? '/data/images/textures/shattered_@2X.png' : prop.map

            } else {

              prop.map = '/data/images/textures/tiles-light.png' // /data/images/textures/gplaypattern_@2X.png'
              prop.specularMap = '/data/images/textures/tiles.png'
              prop.envMap = 'none'

            }
                
            prop.repeat = [ 'wrapping', 12, 12 ]

            break
            case "metal":
                prop.repeat = !!!prop.map ? [ 'wrapping', 3, 3 ] : [ 'wrapping', 1, 1 ]
                
                if ( !simpleShading ) {
                  prop.metalnessMap = "/data/images/textures/tiles-light.png" 
                  prop.roughnessMap = '/data/images/textures/gplaypattern_@2X.png'
                  prop.map = !!!prop.map ? '/data/images/textures/shattered_@2X.png' : prop.map

                }

            break
            case "glass":
              prop.specularMap = '/data/images/textures/tiles.png'
              prop.repeat = [ 'wrapping', 2, 2 ]

              if ( !simpleShading ) {

                  prop.roughnessMap = '/data/images/textures/shattered_@2X.png'

              }

            break
            case "plastic":
                prop.repeat = [ 'wrapping', 2, 2 ]
                prop.map = '/data/images/textures/gplaypattern_@2X.png'

                if ( !simpleShading ) {

                  prop.metalnessMap = "/data/images/textures/tiles.png" 
                  prop.roughnessMap = '/data/images/textures/shattered_@2X.png'

                }

            default:
            break

          }

          if ( simpleShading ) {

             prop.envMap = 'none'

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

         