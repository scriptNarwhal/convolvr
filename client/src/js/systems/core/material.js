import {
  _initMaterialProp,
  _initMaterialConfig
} from './material-init'
import ProceduralMaterials from './material-procedural'

export default class MaterialSystem {

    constructor ( world ) {

        this.world = world
        this.procedural = new ProceduralMaterials( this, world )
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

            loadedMat.map = this.procedural.generateTexture( prop.procedural )
          

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
                    roughnessMap.wrapS = roughnessMap.wrapT = THREE.ClampToEdgeWrapping
                    !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                    roughnessMap.anisotropy = anisotropy / simpleShading ? 2.0 : 1
                    mat.roughnessMap = roughnessMap
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapCallback = diffuse => { 

                    diffuse.wrapS = diffuse.wrapT = THREE.ClampToEdgeWrapping
                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapAndRoughnessCallback = diffuse => {

                    diffuse.wrapS = diffuse.wrapT = THREE.ClampToEdgeWrapping
                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( prop.roughnessMap, textureConfig, roughnessCallback )

                  },
                  metalnessCallback = metalnessMap => {

                    metalnessMap.wrapS = metalnessMap.wrapT = THREE.ClampToEdgeWrapping
                    !!prop.repeat && this._setTextureRepeat( metalnessMap, prop.repeat )
                    metalnessMap.anisotropy = anisotropy / simpleShading ? 2.0 : 1
                    mat.metalnessMap = metalnessMap
                    material = materialSystem._initMaterial( prop, mat, shading, basic, mobile )

                  },
                  mapAndMetalnessCallback = diffuse => {

                    diffuse.wrapS = diffuse.wrapT = THREE.ClampToEdgeWrapping
                    !!prop.repeat && this._setTextureRepeat( diffuse, prop.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( prop.roughnessMap, textureConfig, metalnessCallback )

                  },
                  metalnessAndRoughnessCallBack = roughnessMap => {

                    roughnessMap.wrapS = roughnessMap.wrapT = THREE.ClampToEdgeWrapping
                    !!prop.repeat && this._setTextureRepeat( roughnessMap, prop.repeat )
                    roughnessMap.anisotropy = anisotropy / simpleShading ? 2.0 : 1
                    mat.roughnessMap = roughnessMap
                    assets.loadImage( prop.roughnessMap, textureConfig, metalnessCallback )

                  },
                  mapMetalnessAndRoughnessCallback = tex => {
                    
                    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
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

              specularMap.wrapS = specularMap.wrapT = THREE.ClampToEdgeWrapping
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

      shading = mobile ? "lambert" : shading

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

}

         