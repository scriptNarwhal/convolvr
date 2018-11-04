import {
  _initMaterialProp,
  _initMaterialConfig
} from './material-init'
import ProceduralMaterials from './material-procedural'
import Convolvr from '../../../world/world';
import Component from '../../../core/component';
import AssetSystem from '../assets';

import * as THREE from 'three';
import { System } from '../..';
export default class MaterialSystem implements System {

  public world: Convolvr;
  public dependencies = [["assets"]];
  private assets: AssetSystem;
  public procedural: ProceduralMaterials;
  private mapTypes = [
      "map",
      "roughnessMap",
      "metalnessMap",
      "specularMap",
      "bumpMap"
    ];

    constructor ( world: Convolvr ) {
        this.world = world;
        this.procedural = new ProceduralMaterials(this, world);
    }

    init(component: Component) {

        let materialSystem = this,
            mobile = this.world.mobile,
            attrs = component.attrs,
            attr = attrs.material,
            mat: any = { color: attr.color || 0xffffff },
            assets = this.assets || this.world.systems.assets,
            renderer = (window as any).three.renderer,
            anisotropy = renderer.capabilities.getMaxAnisotropy() / ( mobile ? 2 : 1 ),
            path = '/data',
            material: any = { notInitialized: 1 },
            basic = false,
            textureConfig: any = { },
            envMapUrl = !! attr.envMap ? attr.envMap : assets.envMaps.default,
            reflection = !!envMapUrl ? envMapUrl.replace(path, '') : "",
            pattern = !!attr.procedural ? attr.procedural.name : "",
            materialCode = '',
            shading = !!attr.shading ? attr.shading : 'default',
            simpleShading: boolean = this.world.settings.lighting < 2
            
        basic = _initMaterialProp( attr, simpleShading )
        materialCode = `${attr.repeat ? attr.repeat.join(",") 
                                      : ""}:${attr.name}:${attr.color}:${attr.map}:${attr.specular}:${reflection}:`+
                                           `${attr.alpha}:${attr.bump}:${attr.roughnessMap}:${attr.metalnessMap}:${pattern}`;

      let onMapsLoaded = (loadedMat: any) => {
        if (attr.procedural) {
          loadedMat.map = this.procedural.generateTexture(attr.procedural)
        }
        assets.materials[materialCode] = loadedMat
      }

      if (assets.materials[materialCode] == null) {
        if (!!attr.config) // raw, three.js material attrerties, to override things
          mat = Object.assign({}, mat, attr.config)

        if (!!attr.repeat)
          textureConfig.repeat = attr.repeat

        if (envMapUrl && envMapUrl != "none" && (attr.roughnessMap || attr.metalnessMap) || shading == 'physical') {

          shading = 'physical'
          let allMaps = assets.loadImage(envMapUrl, textureConfig);

          allMaps.then((envMap: any) => {
            envMap.mapping = THREE.EquirectangularReflectionMapping;
            mat.envMap = envMap;

            if (attr.map) {
              allMaps.then(() => {
                assets.loadImage(attr.map, textureConfig)
                  .then((map) => {
                    this.mapCallback(map, "map", mat, attr, shading, basic, mobile, anisotropy, simpleShading, material, materialSystem)
                    if (attr.roughnessMap) {
                      allMaps.then(() => {
                        assets.loadImage(attr.roughnessMap, textureConfig)
                          .then((map) => {
                            this.mapCallback(map, "roughnessMap", mat, attr, shading, basic, mobile, anisotropy, simpleShading, material, materialSystem)
                          })
                      })
                    }
                    if (attr.metalnessMap) {
                      allMaps.then(() => {
                        assets.loadImage(attr.metalnessMap, textureConfig)
                          .then((map) => {
                            this.mapCallback(map, "metalnessMap", mat, attr, shading, basic, mobile, anisotropy, simpleShading, material, materialSystem)
                          })
                      })
                    }
                    allMaps.then(() => {
                      material = this._initMaterial(attr, mat, shading, basic, mobile)
                      if (attr.alphaMap || attr.bumpMap) {
                        this._loadAlphaMap(attr, textureConfig, material, assets, () => {
                          if (!!!attr.bumpMap) { onMapsLoaded(material) } // cache material for later
                        });
                        this._loadBumpMap(attr, textureConfig, material, assets, () => {
                          onMapsLoaded(material) // cache material for later
                        })
                      } else {
                        onMapsLoaded(material)
                      }
                    });
                  });
              });
            }
          }); 
        } else {

            shading = 'phong'
            material = this._initMaterial( attr, mat, shading, basic, mobile )

            attr.specularMap && assets.loadImage( attr.specularMap, textureConfig).then((specularMap: any)=> { 
              specularMap.wrapS = specularMap.wrapT = THREE.ClampToEdgeWrapping;
              specularMap.anisotropy = anisotropy;
              material.specularMap = specularMap;
              material.needsUpdate = true;
            });

            !!attr.map && assets.loadImage( attr.map, textureConfig).then((texture: any) => { 

              if ( !!attr.repeat )
                this._setTextureRepeat( texture, attr.repeat )

              texture.anisotropy = anisotropy
              material.map = texture
              material.needsUpdate = true 
            });

            if ( attr.alphaMap || attr.bumpMap ) {
              this._loadAlphaMap( attr, textureConfig, material, assets, () => {
                if ( !!!attr.bumpMap ) { assets.materials[ materialCode ] = material } // cache material for later
              });
              this._loadBumpMap( attr, textureConfig, material, assets, () => {
                onMapsLoaded( material )  // cache material for later
              });
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
            this.getTextureCode(attr, mapType)
          }
      }
    }

    private mapCallback(
      map: any, mapName: string, mat: any, attr: any, shading: string, basic: boolean, mobile: boolean,
      anisotropy: number, simpleShading: boolean, material: any, ms: MaterialSystem
    ) {
        map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
        !!attr.repeat && this._setTextureRepeat( map, attr.repeat );
        map.anisotropy = anisotropy / (simpleShading ? 2.0 : 1);
        mat[mapName] = map;
    }

    public getTextureCode( attr: any, mapType: string ) {
     return `${attr[mapType]}:${attr.repeat ? attr.repeat.join(".") : ""}`;
    }

    private _loadAlphaMap ( attr: any, textureConfig: any, material: any, assets: AssetSystem, callback: Function ) {
      assets.loadImage( attr.alphaMap, textureConfig)
      .then((texture: any) => { 
        let renderer = this.world.three.renderer

        if ( !!attr.repeat )
          this._setTextureRepeat( texture, attr.repeat )
        
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        material.alphaMap = texture
        material.needsUpdate = true 
        callback()

      })
    }

    private _loadBumpMap (attr: any, textureConfig: any, material: any, assets: AssetSystem, callback: Function) {
            assets.loadImage( attr.bumpMap, textureConfig)
            .then((texture: any) => { 
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

         