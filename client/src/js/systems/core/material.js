import {
  _initMaterialProp,
  _initMaterialConfig
} from './material-init'

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
            pattern = !!prop.procedural ? prop.procedural.name : "",
            materialCode = '',
            shading = !!prop.shading ? prop.shading : 'default',
            simpleShading = this.world.lighting != 'high'
            
        basic = _initMaterialProp( prop, simpleShading )
        materialCode = `${prop.repeat ? prop.repeat.join(",") : ""}:${prop.name}:${prop.color}:${prop.map}:${prop.specular}:${reflection}:${prop.alpha}:${prop.bump}:${pattern}`

        let onMapsLoaded = loadedMat => {

          if ( prop.procedural )

            loadedMat.map = this.generateTexture( prop.procedural )
          

          assets.materials[ materialCode ] = loadedMat

        }

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
                    if ( !!!prop.bumpMap ) { onMapsLoaded( material ) } // cache material for later
                  })

                  this._loadBumpMap( prop, textureConfig, material, assets, () => {
                    onMapsLoaded( material ) // cache material for later
                  })

                } else {
                  
                  onMapsLoaded( material ) 

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
                onMapsLoaded( material )  // cache material for later
              })

            } else {
              
              onMapsLoaded( material ) 

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

      _initMaterialConfig( prop, config, shading, basic, mobile)

      if ( basic ) {

          material = new THREE.MeshBasicMaterial( config )

        } else if ( shading == 'physical' ) {

            material = new THREE.MeshPhysicalMaterial( config )

        } else {

            material = mobile ? new THREE.MeshLambertMaterial( config ) : new THREE.MeshPhongMaterial( config )

        }

        return material

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
          textureCode = params.name, 
          texture = null // probably using size... and.. some data from the rendering
        
      if ( assets.proceduralTextures[ textureCode ] == null ) {  // reference TextSystem for canvas code here..
       
        texture = this._renderTexture( params )

      } else { // use cached version if available

        texture = assets.proceduralTextures[ textureCode ]

      }

      return texture

    }

    _renderTexture( params ) {

      let newTex       = null,
          canvas       = document.createElement("canvas"),
          canvasSize   = [1024, 1024],
          context      = null

      canvas.setAttribute("style", "display:none")
      canvas.width = canvasSize[0]
      canvas.height = canvasSize[1]
      
      document.body.appendChild(canvas)
      context = canvas.getContext("2d")
      newTex = new THREE.Texture( canvas )
      newTex.anisotropy = three.renderer.getMaxAnisotropy()
   
      this._renderInstructions( context, params.calls )

      return newTex

    }

    _renderInstructions ( context, calls, i = 0 ) {

      const DCS  = calls.length
      let   draw = null,
            params = [],
            randoms = [false, false, false, false],
            noise = false,
            c = 0

      while ( c < DCS ) {

        draw = calls[ c ]
        params = draw.params

        if ( noise ) {

          params.map( (p,i) => {

            if ( randoms[i] )

              params[ i ] = randoms[ i ]
             
          })

        }

        switch ( draw.call ) {
          case "noise":
            randoms = [ params[1] * params[0], params[2]* params[0], params[3]* params[0], params[4]* params[0] ]
            noise = Math.abs(params[0]) > 0
          break
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
          break
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
            this._renderLoop ( context, draw.calls, draw.params[0 ], draw.params[ 1 ], draw.params[ 2 ], draw.params[ 3 ] )
          break
        }

        c += 1

      }

    }

    _renderLoop ( context, calls, start, dir, cond, limit ) {

      const MAX = 1000

      let i = start

        if ( cond == "<" ) {
          while ( i < limit && Math.abs(i) < MAX ) {
            
            this._renderInstructions(context, calls, i )
            i += dir == "+" ? 1 : -1
            
          }
        } else {
          while ( i > limit && Math.abs(i) < MAX) {
            
            this._renderInstructions(context, calls, i )
            i += dir == "+" ? 1 : -1
            
          }
        }
      

    }

}

         