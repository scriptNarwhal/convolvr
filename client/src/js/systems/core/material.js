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
            alpha = !!prop.alphaMap ? prop.alphaMap : "",
            bump = !!prop.bumpMap ? prop.bumpMap : "",
            envMapUrl = !! prop.envMap ? prop.envMap : assets.envMaps.default,
            reflection = !!envMapUrl ? envMapUrl.replace(path, '') : "",
            materialCode = '',
            shading = !!prop.shading ? prop.shading : 'default',
            simpleShading = this.world.lighting != 'high'
            
        basic = this._initMaterialProp( prop, simpleShading )
        materialCode = `${prop.repeat ? prop.repeat.join(",") : ""}:${prop.name}:${prop.color}:${prop.map}:${prop.specular}:${reflection}:${prop.alpha}:${prop.bump}`

        if ( assets.materials[ materialCode ] == null ) {

          if ( !! prop.config ) // raw, three.js material properties, to override things

            mat = Object.assign({}, mat, prop.config)

         
          if ( !!prop.repeat )

            textureConfig.repeat = prop.repeat


          if ( envMapUrl && envMapUrl != "none" && (prop.roughnessMap || prop.metalnessMap) || shading == 'physical' ) {

            shading = 'physical'

            assets.loadImage( envMapUrl, textureConfig, ( envMap ) => { 

              envMap.mapping = THREE.EquirectangularReflectionMapping 
              mat.envMap = envMap

              assets.loadImage( prop.roughnessMap, textureConfig, ( roughnessMap ) => {

                !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                roughnessMap.anisotropy = renderer.getMaxAnisotropy()
                mat.roughnessMap = roughnessMap
                
                let roughnessCallback = roughnessMap => { 

                    !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                    roughnessMap.anisotropy = anisotropy / simpleShading ? 2.0 : 1
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
                    metalnessMap.anisotropy = anisotropy / simpleShading ? 2.0 : 1
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
                    roughnessMap.anisotropy = anisotropy / simpleShading ? 2.0 : 1
                    mat.roughnessMap = roughnessMap
                    assets.loadImage( prop.roughnessMap, textureConfig, metalnessCallback )

                  },
                  mapMetalnessAndRoughnessCallback = tex => {
                    
                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( prop.roughnessMap, textureConfig, metalnessAndRoughnessCallBack )

                  }

                if ( prop.roughnessMap && !!! prop.map ) { 
                  
                  assets.loadImage( prop.roughnessMap, textureConfig, roughnessCallback )

                } else if ( prop.roughnessMap && prop.metalnessMap && !!! prop.map ) {
                
                  assets.loadImage( prop.roughnessMap, textureConfig, metalnessAndRoughnessCallBack )

                } else if ( prop.map && prop.roughnessMap ) {
                  
                  assets.loadImage( prop.map, textureConfig, mapAndRoughnessCallback )

                } else if ( !!! prop.roughnessMap && prop.map ) {
                  
                  assets.loadImage( prop.map, textureConfig, mapCallback )

                } else if ( !!!prop.roughnessMap && prop.map && prop.metalnessMap ) {

                  assets.loadImage( prop.map, textureConfig, mapAndMetalnessCallback )

                } else if ( prop.roughnessMap && prop.map && prop.metalnessMap ) {

                  assets.loadImage( prop.map, textureConfig, mapMetalnessAndRoughnessCallback )

                } else {
                  
                  material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                }

                if ( prop.alphaMap || prop.bumpMap ) {

                  this._loadAlphaMap( prop, textureConfig, material, assets, () => {
                    if ( !!!prop.bumpMap ) { assets.materials[ materialCode ] = material } // cache material for later
                  })

                  this._loadBumpMap( prop, textureConfig, material, assets, () => {
                    assets.materials[ materialCode ] = material // cache material for later
                  })

                } else {
                  
                  assets.materials[ materialCode ] = material 

                }

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

              if ( !!prop.repeat )

                this._setTextureRepeat( texture, prop.repeat )

              texture.anisotropy = renderer.getMaxAnisotropy()
              material.map = texture
              material.needsUpdate = true 

            })

            if ( prop.alphaMap || prop.bumpMap ) {
              
              this._loadAlphaMap( prop, textureConfig, material, assets, () => {
                if ( !!!prop.bumpMap ) { assets.materials[ materialCode ] = material } // cache material for later
              })

              this._loadBumpMap( prop, textureConfig, material, assets, () => {
                assets.materials[ materialCode ] = material // cache material for later
              })

            } else {
              
              assets.materials[ materialCode ] = material 

            }

          } 

        } else {

          material = assets.materials[ materialCode ]

        }

      return {
          material,
          materialCode
      }

    }

    _loadAlphaMap ( prop, textureConfig, material, assets, callback ) {

      assets.loadImage( prop.alphaMap, textureConfig, texture => { 
        
        let renderer = this.world.three.renderer

        if ( !!prop.repeat )
        
          this._setTextureRepeat( texture, prop.repeat )
        
        texture.anisotropy = renderer.getMaxAnisotropy()
        material.alphaMap = texture
        material.needsUpdate = true 
        callback()

      })

    }

    _loadBumpMap ( prop, textureConfig, material, assets, callback ) {
      
            assets.loadImage( prop.bumpMap, textureConfig, texture => { 
              
              let renderer = this.world.three.renderer
      
              if ( !!prop.repeat )
              
                this._setTextureRepeat( texture, prop.repeat )
              
              texture.anisotropy = renderer.getMaxAnisotropy()
              material.bumpMap = texture
              material.needsUpdate = true 
              callback()
      
            })
      
      }

    _initMaterial( prop, config, shading, basic, mobile ) {

      let material = null

      this._initMaterialConfig( prop, config, shading, basic, mobile)

      if ( basic ) {

          material = new THREE.MeshBasicMaterial( config )

        } else if ( shading == 'physical' ) {

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
                  mat.shininess = 1.0

                }
              break
              case "terrain2":
                
              break
              case "terrain4":
                  mat.metalness = 0.5
                  mat.roughness = 1.0
                  mat.shininess = 0.05
              break
              case "tree":
                mat.transparent = !mobile
              break
              case "metal":
                if ( shading == 'physical' ) {

                  mat.metalness = 1.5

                } else {

                  mat.specular = 0xffffff
                  mat.shininess = 7.4

                }
              break
              case "hard-light":
                if (!mobile && prop.bumpMap ) {
                  mat = Object.assign({}, mat, {
                    color: 0x0040ff,
                    specular: 0x0242ff,
                    shininess: 45,
                    bumpScale: 440
                  } );
                }
              break
              case "glass":
                if ( shading == 'physical' ) {

                  mat.metalness = 1.0

                } else {

                  mat.specular = 0xffffff
                  mat.shininess = 9.4

                }
                mat.transparent = true
                mat.opacity = 0.9
              break
              case "plastic":
                if ( shading == 'physical' ) {

                  mat.metalness = 0.75

                } else {

                  mat.specular = 0xffffff
                  mat.shininess = 2.0

                }
              default:
              break

          }

    }

    _initMaterialProp ( prop, simpleShading ) { // material presets & configuration

      let basic = false

      switch ( prop.name ) { 

            case "wireframe":
                basic = true
            break
            case "basic": // mesh basic material
                basic = true
            break
            case "terrain":
            if ( !simpleShading ) {

              //prop.metalnessMap = "/data/images/textures/tiles.png" 
              prop.roughnessMap = '/data/images/textures/gplaypattern_@2X-2.png'
              prop.map = !!!prop.map ? '/data/images/textures/shattered_@2X-2.png' : prop.map

            } else {

              prop.map = '/data/images/textures/gplaypattern_@2X-2.png'
              prop.envMap = 'none'

            }
                
            prop.repeat = [ 'wrapping', 12, 12 ]
            break
            case "terrain2":
            if ( !simpleShading ) {

              prop.map = !!!prop.map ? '/data/images/textures/terrain1.jpg' : prop.map

            } else {

              prop.map = '/data/images/textures/terrain1.jpg' // /data/images/textures/gplaypattern_@2X-2.png'
              prop.envMap = 'none'

            }
            prop.repeat = [ 'wrapping', 8, 8 ]
            break
            case "terrain3":
              if ( !simpleShading ) {
  
                prop.map = !!!prop.map ? '/data/images/textures/terrain2.jpg' : prop.map
                prop.roughnessMap = '/data/images/textures/shattered_@2X-2.png'
  
              } else {
                        
                prop.map = '/data/images/textures/terrain2.jpg' // /data/images/textures/gplaypattern_@2X-2.png'
                prop.envMap = 'none'
            
              }
                      
              prop.repeat = [ 'wrapping', 10, 10 ]
            break
            case "terrain4":
              if ( !simpleShading ) {

               prop.metalnessMap = "/data/images/textures/terrain3.jpg" 
                prop.map = !!!prop.map ? '/data/images/textures/terrain3.jpg' : prop.map

              } else {

                prop.map = '/data/images/textures/terrain3.jpg'
                prop.envMap = 'none'
            
              }
                      
              prop.repeat = [ 'wrapping', 10, 10 ]
            break
            case "organic":
            if ( !simpleShading ) {

              prop.roughnessMap = "/data/images/textures/tiles-light.png" 
              prop.map = !!!prop.map ? '/data/images/textures/tiles-light.png' : prop.map

            } else {

              prop.map = '/data/images/textures/tiles-light.png' // /data/images/textures/gplaypattern_@2X-2.png'
              prop.envMap = 'none'

            }

            prop.repeat = [ 'wrapping', 6, 6 ]
            break
            case "tree":
            if ( !simpleShading ) {

              //prop.roughnessMap = "/data/images/textures/tiles-light.png"
              prop.map = !!!prop.map ? '/data/images/textures/foliage1.jpg' : prop.map
              prop.alphaMap = "/data/images/textures/tiles-light.png"

            } else {

              prop.map = '/data/images/textures/foliage1.jpg' 
              prop.envMap = 'none'

            }
            
            prop.repeat = [ 'wrapping', 6, 6 ]
            break
            case "metal":

                prop.repeat = !!!prop.map ? [ 'wrapping', 3, 3 ] : [ 'wrapping', 1, 1 ]
                
                if ( !simpleShading )
                  
                  prop.metalnessMap = "/data/images/textures/gplaypattern_@2X-2.png" 
                

                prop.map = !!!prop.map ? '/data/images/textures/shattered_@2X-2.png' : prop.map

            break
            case "glass":

              prop.repeat = [ 'wrapping', 18, 18 ]

              if ( !simpleShading ) {

                  prop.metalnessMap = '/data/images/textures/shattered_@2X-2.png'

              } else {

                prop.specularMap = '/data/images/textures/tiles.png'

              }

            break
            case "hard-light":

            prop.map = '/data/images/textures/surface03.jpg'

            if ( !simpleShading )
              
                prop.metalnessMap = '/data/images/textures/surface03.jpg'

            break
            case "plastic":

                prop.repeat = [ 'wrapping', 2, 2 ]
                prop.map = !!!prop.map ? '/data/images/textures/gplaypattern_@2X-2.png' : prop.map

                if ( !simpleShading )

                  prop.metalnessMap = "/data/images/textures/tiles.png" 


            default:
            break

          }

          if ( simpleShading )

             prop.envMap = 'none'


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
        
      if ( assets.proceduralTextures[ textureCode ] == null ) {  // reference TextSystem for canvas code here..
       
        texture = this._renderTexture( params )

      } else { // use cached version if available

        texture = assets.proceduralTextures[ textureCode ]

      }

      return texture

    }

    _renderTexture( params ) {

      let prop         = component.props.text,
          newTex       = null,
          textMaterial = null,
          canvas       = document.createElement("canvas"),
          canvasSize   = !!prop.label ? [512, 128] : [1024, 1024],
          context      = null,
          config       = { label: !!prop.label }

      canvas.setAttribute("style", "display:none")
      canvas.width = canvasSize[0]
      canvas.height = canvasSize[1]
      
      document.body.appendChild(canvas)
      context = canvas.getContext("2d")
      newTex = new THREE.Texture( canvas )
      newTex.anisotropy = three.renderer.getMaxAnisotropy()
      textMaterial.map.needsUpdate = true
   
      this._renderInstructions( context, params.calls )

      return newTex

    }

    _renderInstructions ( context, calls, i =0 ) {

      const DCS  = calls.length
      let   draw = null,
            params = [],
            c = 0

      while ( c < DCS ) {

        draw = calls[ c ]
        params = draw.params

        switch ( draw.call ) {
          case "fillStyle":
            context.fillStyle = draw.params[0]
          break
          case "strokeStyle":
            context.fillStyle = draw.params[0]
          break
          case "beginPath":
            context.beginPath()
          break
          case "moveTo":
            context.moveTo( params[0], params[1] )
          case "lineTo":
            context.lineTo( params[0], params[1] )
          break
          case "stroke":
            context.stroke()
          break
          case "fillRect":
            context.fillRect( params[ 0 ], params[ 1 ], params[ 2 ], params[ 3 ] )
          break
          case "arc":
            context.arc( params[ 0 ], params[ 1 ], params[ 2 ], params[ 3 ] )
          break
          case "text":
            context.fillText( params[ 0 ], params[ 1 ], params[ 2 ] )
          break
          case "loop":
            this.renderLoop ( draw.params[0 ], draw.params[ 1 ], draw.params[ 2 ], draw.params[ 3 ] )
          break
        }
        c += 1

      }

    }

    _renderLoop ( start, dir, cond, limit ) {

      const MAX = 10000

      let i = start

        if ( cond == "<" ) {
          while ( i < limit && Math.abs(i) < MAX ) {
            
            this._renderInstructions(context, draw.calls, i )
            i += dir == "+" ? 1 : -1
            
          }
        } else {
          while ( i > limit && Math.abs(i) < MAX) {
            
            this._renderInstructions(context, draw.calls, i )
            i += dir == "+" ? 1 : -1
            
          }
        }
      

    }

}

         