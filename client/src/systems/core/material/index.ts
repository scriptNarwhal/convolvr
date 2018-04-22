import {
  _initMaterialProp,
  _initMaterialConfig
} from './material-init'
import ProceduralMaterials from './material-procedural'
import Convolvr from '../../../world/world';
import Component from '../../../core/component';
import AssetSystem from '../assets';

const THREE = (window as any).THREE;
export default class MaterialSystem {

  private world: Convolvr
  public procedural: ProceduralMaterials

    constructor ( world: Convolvr ) {
        this.world = world
        this.procedural = new ProceduralMaterials( this, world )
    }

    init(component: Component) {

        let materialSystem = this,
            mobile = this.world.mobile,
            attrs = component.attrs,
            attr = attrs.material,
            mat: any = { color: attr.color || 0xffffff },
            assets = this.world.systems.assets,
            renderer = (window as any).three.renderer,
            anisotropy = renderer.capabilities.getMaxAnisotropy() / ( mobile ? 2 : 1 ),
            path = '/data',
            material: any = null,
            basic = false,
            textureConfig: any = { },
            diffuse = !!attr.map ? attr.map.replace(path, '') : "",
            specular = !!attr.specularMap ? attr.specularMap.replace(path, '') : "",
            alpha = !!attr.alphaMap ? attr.alphaMap : "",
            bump = !!attr.bumpMap ? attr.bumpMap : "",
            envMapUrl = !! attr.envMap ? attr.envMap : assets.envMaps.default,
            reflection = !!envMapUrl ? envMapUrl.replace(path, '') : "",
            pattern = !!attr.procedural ? attr.procedural.name : "",
            materialCode = '',
            shading = !!attr.shading ? attr.shading : 'default',
            simpleShading: boolean = this.world.settings.lighting < 2
            
        basic = _initMaterialProp( attr, simpleShading )
        materialCode = `${attr.repeat ? attr.repeat.join(",") : ""}:${attr.name}:${attr.color}:${attr.map}:${attr.specular}:${reflection}:`+
                                                                   `${attr.alpha}:${attr.bump}:${attr.roughnessMap}:${attr.metalnessMap}:${pattern}`;

        let onMapsLoaded = (loadedMat: any) => {

          if ( attr.procedural )
            loadedMat.map = this.procedural.generateTexture( attr.procedural )
          
          assets.materials[ materialCode ] = loadedMat
        }

        if ( assets.materials[ materialCode ] == null ) {
          if ( !! attr.config ) // raw, three.js material attrerties, to override things
            mat = Object.assign({}, mat, attr.config)

          if ( !!attr.repeat )
            textureConfig.repeat = attr.repeat

          if ( envMapUrl && envMapUrl != "none" && (attr.roughnessMap || attr.metalnessMap) || shading == 'physical' ) {

            shading = 'physical'
            assets.loadImage( envMapUrl, textureConfig, ( envMap: any ) => { 

              envMap.mapping = THREE.EquirectangularReflectionMapping 
              mat.envMap = envMap

              assets.loadImage( attr.roughnessMap, textureConfig, ( roughnessMap: any ) => {

                !!attr.repeat && this._setTextureRepeat( roughnessMap, attr.repeat )
                roughnessMap.anisotropy = renderer.capabilities.getMaxAnisotropy()
                mat.roughnessMap = roughnessMap
                
                let roughnessCallback = (roughnessMap: any) => { 
                    roughnessMap.wrapS = roughnessMap.wrapT = THREE.ClampToEdgeWrapping
                    !!attr.repeat && this._setTextureRepeat( roughnessMap, attr.repeat )
                    roughnessMap.anisotropy = anisotropy / (simpleShading ? 2.0 : 1);
                    mat.roughnessMap = roughnessMap
                    material = materialSystem._initMaterial( attr, mat, shading, basic, mobile )
                  },
                  mapCallback = (diffuse: any) => { 

                    diffuse.wrapS = diffuse.wrapT = THREE.ClampToEdgeWrapping
                    !!attr.repeat && this._setTextureRepeat( diffuse, attr.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    material = materialSystem._initMaterial( attr, mat, shading, basic, mobile )
                  },
                  mapAndRoughnessCallback = (diffuse: any) => {

                    diffuse.wrapS = diffuse.wrapT = THREE.ClampToEdgeWrapping
                    !!attr.repeat && this._setTextureRepeat( diffuse, attr.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( attr.roughnessMap, textureConfig, roughnessCallback )
                  },
                  metalnessCallback = (metalnessMap: any) => {

                    metalnessMap.wrapS = metalnessMap.wrapT = THREE.ClampToEdgeWrapping
                    !!attr.repeat && this._setTextureRepeat( metalnessMap, attr.repeat )
                    metalnessMap.anisotropy = anisotropy / (simpleShading ? 2.0 : 1);
                    mat.metalnessMap = metalnessMap
                    material = materialSystem._initMaterial( attr, mat, shading, basic, mobile )
                  },
                  mapAndMetalnessCallback = (diffuse: any) => {

                    diffuse.wrapS = diffuse.wrapT = THREE.ClampToEdgeWrapping
                    !!attr.repeat && this._setTextureRepeat( diffuse, attr.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( attr.roughnessMap, textureConfig, metalnessCallback )
                  },
                  metalnessAndRoughnessCallBack = (roughnessMap: any) => {

                    roughnessMap.wrapS = roughnessMap.wrapT = THREE.ClampToEdgeWrapping
                    !!attr.repeat && this._setTextureRepeat( roughnessMap, attr.repeat )
                    roughnessMap.anisotropy = anisotropy / (simpleShading ? 2.0 : 1);
                    mat.roughnessMap = roughnessMap
                    assets.loadImage( attr.roughnessMap, textureConfig, metalnessCallback )
                  },
                  mapMetalnessAndRoughnessCallback = (tex: any) => {
                    
                    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
                    !!attr.repeat && this._setTextureRepeat( diffuse, attr.repeat )
                    diffuse.anisotropy = anisotropy
                    mat.map = diffuse
                    assets.loadImage( attr.roughnessMap, textureConfig, metalnessAndRoughnessCallBack )
                  }

                if ( attr.roughnessMap && !!! attr.map ) { 
                  assets.loadImage( attr.roughnessMap, textureConfig, roughnessCallback )
                } else if ( attr.roughnessMap && attr.metalnessMap && !!! attr.map ) {
                  assets.loadImage( attr.roughnessMap, textureConfig, metalnessAndRoughnessCallBack )
                } else if ( attr.map && attr.roughnessMap ) {
                  assets.loadImage( attr.map, textureConfig, mapAndRoughnessCallback )
                } else if ( !!! attr.roughnessMap && attr.map ) {
                  assets.loadImage( attr.map, textureConfig, mapCallback )
                } else if ( !!!attr.roughnessMap && attr.map && attr.metalnessMap ) {
                  assets.loadImage( attr.map, textureConfig, mapAndMetalnessCallback )
                } else if ( attr.roughnessMap && attr.map && attr.metalnessMap ) {
                  assets.loadImage( attr.map, textureConfig, mapMetalnessAndRoughnessCallback )
                } else {
                  material = materialSystem._initMaterial( attr, mat, shading, basic, mobile )
                }

                if ( attr.alphaMap || attr.bumpMap ) {
                  this._loadAlphaMap( attr, textureConfig, material, assets, () => {
                    if ( !!!attr.bumpMap ) { onMapsLoaded( material ) } // cache material for later
                  })
                  this._loadBumpMap( attr, textureConfig, material, assets, () => {
                    onMapsLoaded( material ) // cache material for later
                  })
                } else {
                  onMapsLoaded( material ) 
                }
              })
            })
            
          } else {

            shading = 'phong'
            material = this._initMaterial( attr, mat, shading, basic, mobile )

            attr.specularMap && assets.loadImage( attr.specularMap, textureConfig, (specularMap: any) => { 

              specularMap.wrapS = specularMap.wrapT = THREE.ClampToEdgeWrapping
              specularMap.anisotropy = anisotropy
              material.specularMap = specularMap
              material.needsUpdate = true 

            })

            !!attr.map && assets.loadImage( attr.map, textureConfig, (texture: any) => { 

              if ( !!attr.repeat )
                this._setTextureRepeat( texture, attr.repeat )

              texture.anisotropy = anisotropy
              material.map = texture
              material.needsUpdate = true 

            })

            if ( attr.alphaMap || attr.bumpMap ) {
              
              this._loadAlphaMap( attr, textureConfig, material, assets, () => {
                if ( !!!attr.bumpMap ) { assets.materials[ materialCode ] = material } // cache material for later
              })

              this._loadBumpMap( attr, textureConfig, material, assets, () => {
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
          materialCode,
          getTextureCode: (mapType: string) => {
            this._getTextureCode(attr, mapType)
          }
      }
    }

    _getTextureCode( attr: any, mapType: string ) {
     return `${attr[mapType]}:${attr.repeat ? attr.repeat.join(".") : ""}`;
    }

    _loadAlphaMap ( attr: any, textureConfig: any, material: any, assets: AssetSystem, callback: Function ) {

      assets.loadImage( attr.alphaMap, textureConfig, (texture: any) => { 
        
        let renderer = this.world.three.renderer

        if ( !!attr.repeat )
          this._setTextureRepeat( texture, attr.repeat )
        
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        material.alphaMap = texture
        material.needsUpdate = true 
        callback()

      })
    }

    _loadBumpMap (attr: any, textureConfig: any, material: any, assets: AssetSystem, callback: Function) {
      
            assets.loadImage( attr.bumpMap, textureConfig, (texture: any) => { 
              
              let renderer = this.world.three.renderer
      
              if ( !!attr.repeat )
                this._setTextureRepeat( texture, attr.repeat )
              
              texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
              material.bumpMap = texture
              material.needsUpdate = true 
              callback()
      
            })
      
      }

    _initMaterial(attr: any, config: any, shading: any, basic: boolean, mobile: boolean) {

      let material = null

      shading = mobile ? "lambert" : shading

      _initMaterialConfig( attr, config, shading, basic, mobile)


      if ( basic ) {
          material = new THREE.MeshBasicMaterial( config )
        } else if ( shading == 'physical' ) {
            material = new THREE.MeshPhysicalMaterial( config )
        } else {
            material = mobile ? new THREE.MeshLambertMaterial( config ) : new THREE.MeshPhongMaterial( config )
        }

        return material
    }

    _setTextureRepeat ( texture: any, repeat: any[] ) {

      if ( repeat[0] == "wrapping" ) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
			    texture.repeat.set(repeat[1], repeat[2])
          //texture.needsUpdate = true
      }
    }

}

         