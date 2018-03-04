import axios from 'axios';
import { API_SERVER } from '../../config.js'

import Entity from '../../core/entity'
import BuiltinProps from '../../assets/attributes'
import avatar from '../../assets/entities/avatars/avatar'
import hero from '../../assets/entities/avatars/hero'
import toolMenu from '../../assets/entities/tools/core/tool-menu'
import helpScreen from '../../assets/entities/misc/help-screen'
import chatScreen from '../../assets/entities/tools/social/chat-screen'
import videoChat from '../../assets/entities/tools/video/video-chat'

import previewBox from '../../assets/entities/misc/preview-box'
import panel1 from '../../assets/entities/misc/panel-1'
import panel3 from '../../assets/entities/misc/panel-3'
import block from '../../assets/entities/misc/block'
import column1 from '../../assets/entities/misc/column-1'
import wirebox from '../../assets/entities/misc/wirebox'
import fileBrowser from '../../assets/entities/information/file-browser'

import panel1Comp from '../../assets/components/misc/panel-1'
import column1Comp from '../../assets/components/misc/column-1'
import panel2Comp from '../../assets/components/misc/panel-2'
import column2Comp from '../../assets/components/misc/column-2'

import battleship from '../../assets/entities/vehicles/battleship'
import car from '../../assets/entities/vehicles/car'

export default class AssetSystem {

    constructor ( world: Convolvr ) {
        this.world                = world
        this.geometries           = {}
        this.materials            = {}
        this.textures             = {}
        this.proceduralTextures   = {}
        this.envMaps              = {
            default: '/data/images/photospheres/sky-reflection.jpg'
        }
        this.audioBuffers         = {}
        this.models               = {}
        this.entities             = []
        this.autoDecrementEntity  = -1 // entities loaded from network / db have positive ids
        this.components           = []
        this.entitiesByName       = {}
        this.componentsByName     = {}

        this.userEntitiesByName   = {}
        this.userComponentsByName = {}
        this.loadingItemsById   = { entities: {}, components: {}, attrerties: {}}
        this.userEntities         = []
        this.userComponents       = []
        this.places               = []
        this.spaces               = []
        this.attrs                = BuiltinProps()
        this.files                = [] // user's files; separate from entity file systems
        this.directories          = [] // user's directories
        this.textureLoader        = new THREE.TextureLoader()
        this.audioLoader          = new THREE.AudioLoader()
        this._initBuiltInEntities()
        this._initBuiltInComponents()
    }

    init ( component ) { 

        let attr = component.attrs.assets

        return {
            
        }
    }

    loadImage ( asset, config, callback ) {

        let texture = null,
            configCode = !!config.repeat ? `:repeat:${config.repeat.join('.')}` : '',
            textureCode = `${asset}:${configCode}`

        if ( this.textures[ textureCode ] == null ) {
            texture = this.textureLoader.load(asset, texture => { callback(texture) })
            this.textures[ textureCode ] = texture
        } else {
            texture = this.textures[ textureCode ]
        }

        callback( texture )
    }

    loadSound ( asset, sound, callback ) {

        if (this.audioBuffers[ asset ] == null) {

           this.audioLoader.load( asset, buffer => {
                sound.setBuffer( buffer )
                callback()
           })

        } else {
            sound.setBuffer( this.audioBuffers[ asset ] )
            callback()
        }
    }

    loadModel ( asset, callback ) {
        // use obj and fbx systems
        let systems = this.world.systems,
            obj = systems.obj,
            fbx = systems.fbx

        // implement
        // check format from file extension
        // use apattrriate loader..
        // fire callback
    }

    loadShaders ( vertex_url: string, fragment_url: string, onLoad: Function, onProgress: Function, onError: Function ) { // based off http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
		var vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager)

		vertex_loader.setResponseType('text')
		vertex_loader.load( vertex_url, vertex_text => {

			var fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager)
			fragment_loader.setResponseType('text')
			fragment_loader.load( fragment_url, fragment_text => {
				onLoad(vertex_text, fragment_text)
			});

		}, onProgress, onError)
	}

    getEnvMapFromColor ( r, g, b ) {

        let envURL = '/data/images/photospheres/sky-reflection.jpg'

        if ( r !== g && g !== b ) {
            
            if ( g > b ) {
                if ( r > b && g > r /3  ) {
                    envURL = '/data/images/photospheres/sky-reflection-o'
                } else if (red < 0.2 && blue < 0.2) {
                    envURL = '/data/images/photospheres/sky-reflection-g'
                } else {
                    envURL = '/data/images/photospheres/sky-reflection-r'
                }               
            } else if ( b > r ) {
                if ( g > r ) {
                    envURL = '/data/images/photospheres/sky-reflection-c'
                } else if ( r > (b / 6.0) ) {
                    envURL = '/data/images/photospheres/sky-reflection-p'
                } else {
                    envURL = '/data/images/photospheres/sky-reflection-b'
                }
            }
        }

        if (r+g+b < 2.0)
            envURL += '-d'

        return `${envURL}.jpg`
    }

    setSpaces ( spaces ) {
        this.spaces = spaces
    }

    setPlaces ( places ) {
        this.places = places
    }

    loadInventoryEntity ( username, itemId, callback ) {
        let assets = this
        if (this.loadingItemsById.entities[ itemId ]) { return }
        console.log("continuing to load")
        this.loadingItemsById.entities[ itemId ] = true
         return axios.get(API_SERVER+"/api/inventory/"+username+"/Entities/"+itemId)
                .then(response => {
                    assets.addUserEntities( [ response.data ] )
                    assets.loadingItemsById.entities[ itemId ] = false
                }).catch(response => {
                   console.error(response)
                })
    }

    loadInventoryComponent ( username, itemId, callback ) {
        let assets = this
        if (this.loadingItemsById.components[ itemId ]) { return }
        this.loadingItemsById.components[ itemId ] = true
         return axios.get(API_SERVER+"/api/inventory/"+username+"/Components/"+itemId)
                .then(response => {
                    assets.addUserComponents( [ response.data ] )
                    assets.loadingItemsById.components[ itemId ] = false
                }).catch(response => {
                    console.error(response)
                })
    }

    isEntityLoaded ( entityName ) {
        let found = false
        
        if ( this.entitiesByName[ entityName ] != null ) {
            found = true
        }
        if ( this.userEntitiesByName[ entityName ] != null ) {
            found = true
        }
        return found
    }

    addUserEntities ( entities ) {
        let assets = this
        entities.map( ent => {
            assets.userEntitiesByName[ ent.name ] = ent
        })
        this.userEntities = this.userEntities.concat( entities )
    }

    addUserComponents ( components ) {
        let assets = this
        components.map( comp => {
            assets.userComponentsByName[ comp.name ] = comp
        })
        this.userComponents = this.userComponents.concat( components )
    }

    addUserProperties ( attrerties ) {
        this.userProperties = this.userProperties.concat( attrerties )
    }

    addUserAssets ( assets ) {
        this.systems.asset = this.systems.asset.concat( assets )
    }

    setUserFiles ( files ) {
        this.files = files
    }

    addUserFiles ( files ) {
        this.files = this.files.concat( files )
    }

    setUserDirectories ( directories ) {
        this.directories = directories
    }

    addUserDirectories ( directories ) {
        this.directories = this.directories.concat( directories )
    }

    makeEntity ( name,  init, config, voxel  ) {
        console.log("make entity ", name)
        let builtIn = this.entitiesByName,
            library = builtIn[ name ] != null ? builtIn : this.userEntitiesByName,
            toMake = library[ name ],
            ent = typeof toMake == 'function' ? toMake( this, config, voxel ) : toMake

        if ( init ) {
            return new Entity( ent.id, ent.components, ent.position, ent.quaternion, voxel )
        } else {
            return { ...ent, voxel }
        }
    }

    makeComponent ( name, data, config ) {
        let builtIn = this.componentsByName,
            library = builtIn[ name ] != null ? builtIn : this.userComponentsByName

        if ( data ) {
            return { ...library[ name ], data }
        } else {
            return { ...library[ name ] }
        }
    }

    getMaterialProp ( name ) {

        let attr = null
        
        this.attrs.material.map(( mat, i ) => {
            if ( mat.name == name ) 
                attr = mat
            
        })

        return { ...attr }
    }

    autoEntityID ( ) {
        this.autoDecrementEntity --
        return this.autoDecrementEntity
    }

    _addBuiltInComponent ( name, data ) {
        this.components.push(data)
        this.componentsByName[name] = data
    }

    _addBuiltInEntity ( name, data ) {
        this.entities.push(data)
        this.entitiesByName[name] = data
    }

    _initBuiltInComponents ( ) {
        this._addBuiltInComponent("panel", panel1Comp)
        this._addBuiltInComponent("column", column1Comp)
        this._addBuiltInComponent("panel2", panel2Comp)
        this._addBuiltInComponent("column2", column2Comp)
    }

    _initBuiltInEntities ( ) {
        this._addBuiltInEntity( "default-avatar", avatar )
        this._addBuiltInEntity( "hero", hero )
        this._addBuiltInEntity( "tool-menu", toolMenu )
        this._addBuiltInEntity( "help-screen", helpScreen )
        this._addBuiltInEntity( "chat-screen", chatScreen )
        this._addBuiltInEntity( "video-chat", videoChat )
        this._addBuiltInEntity( "file-browser", fileBrowser )
        this._addBuiltInEntity( "panel", panel1 )
        this._addBuiltInEntity( "preview-box", previewBox )
        this._addBuiltInEntity( "panel3", panel3 )
        this._addBuiltInEntity( "block",  block )
        this._addBuiltInEntity( "column1", column1 )
        this._addBuiltInEntity( "wirebox", wirebox )
        this._addBuiltInEntity( "icon", this._initButton() )
    }

    _loadPlaces ( places ) {
        // implement.. call this from redux action
        this.places = places
    }

    _loadSpaces ( spaces ) { 
        // implement call this from redux action
        this.spaces = spaces
    }

    _initButton ( component, data ) {

        let color = data && data.color ? data.color : 0x151515,
            components = [],
            button = null,
            x = 2
        
        if ( !!component ) { 

            button = component

        } else {

            button = { // TODO: come back to this
                attrs: {
                    // activate: true,
                    // hover: true,
                    // lookAway,
                    geometry: {
                        merge: false,
                        shape: "node",
                        size: [ 1, 1, 1 ]
                    },
                        material: {
                        name: "plastic",
                        color: 0
                    }
                },
                position: [ 0, 0, 0 ],
                quaternion: null,
                components: []
            }

        }
    
       
        // button.components.push({ // back plate, behind icon
        //         attrs: {
        //             geometry: {
        //                 merge: false,
        //                 size: [ 0.4, 0.4, 0.09 ],
        //                 shape: "box"
        //             },
        //             material: {
        //                 color: color,
        //                 name: "metal"
        //             }
        //         },
        //         position: [ 0, 0, -4000 ],
        //         quaternion: null
        //     })

        return button
    }

    initIconProps ( color, texture ) {

        let material = {
            name: "metal",
            color,
            config: {
                emissive: color,
                emissiveIntensity: 0.5
            }
        }

        if ( !!texture )

            material.map = texture

        return {
            material,
            geometry: {
                shape: "box",
                faceNormals: true,
                size: [ 0.333, 0.333, 0.333 ]
            }
        }
    }
}