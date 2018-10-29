import axios, { AxiosPromise } from 'axios';
import { API_SERVER } from '../../config'

import Entity, { DBEntity } from '../../core/entity'
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

import fileBrowser from '../../assets/entities/information/hardware/file-browser'
import terminal from '../../assets/entities/information/hardware/terminal'
import keyboard from '../../assets/entities/information/hardware/keyboard'
import pointingDevice from '../../assets/entities/information/hardware/pointing-device'
import printer from '../../assets/entities/information/hardware/printer'

import panel1Comp from '../../assets/components/misc/panel-1'
import column1Comp from '../../assets/components/misc/column-1'
import panel2Comp from '../../assets/components/misc/panel-2'
import column2Comp from '../../assets/components/misc/column-2'
import seat from '../../assets/components/vehicle/seat'
import vehicle from '../../assets/components/vehicle/seat'
import handle from '../../assets/components/tool/handle'
import weapon from '../../assets/components/tool/weapon'

import HardwareDevices from '../../assets/components/information/hardware';
import ASTLiterals from '../../assets/components/information/software/ecs/ast/literals'
import ECSObjects from '../../assets/components/information/software/ecs/object'
import ASTExpressions from '../../assets/entities/information/software/ecs/ast/expressions'
import ASTStatements from '../../assets/entities/information/software/ecs/ast/statements'
import BuiltinPallet from '../../assets/entities/information/software/ecs/builtin-pallet'
import ExpressionPallet from '../../assets/entities/information/software/ecs/expression-pallet'
import LiteralPallet from '../../assets/entities/information/software/ecs/literal-pallet'
import StatementPallet from '../../assets/entities/information/software/ecs/statement-pallet'

import battleship from '../../assets/entities/vehicles/battleship'
import car from '../../assets/entities/vehicles/car'
import Convolvr from '../../world/world.js';
import Component, { DBComponent } from '../../core/component.js';

import * as THREE from 'three';
import { Flags, AnyObject } from '../../util';

export default class AssetSystem {

    private world: Convolvr
    public geometries: any
    public materials: any
    public textures: any
    public proceduralTextures: any
    public envMaps: any
    public audioBuffers: any
    public audioElements: any
    public models: any
    public entities: any
    public autoDecrementEntity: any // entities loaded from network / db have positive ids
    public components: any
    public entitiesByName: any
    public componentsByName: any
    public userEntitiesByName: any
    public userComponentsByName: any
    public loadingItemsById: { entities: Flags, components: Flags, attrerties: Flags}
    public userEntities: any[]
    public userComponents: any[]
    public userProperties: any[]
    public places: any
    public spaces: any
    public attrs: any
    public files: any
    public directories: any
    public textureLoader: any
    public audioLoader: any

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
        this.audioElements        = {}
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

    public init(component: Component) { 
        let attr = component.attrs.assets

        return {}
    }

    public loadImage(asset: string, config: any): Promise<any> {
        let texture = null,
            configCode = !!config.repeat ? `:repeat:${config.repeat.join('.')}` : '',
            textureCode = `${asset}:${configCode}`,
            assets = this;

        return new Promise((resolve, reject)=>{
            if ( this.textures[ textureCode ] == null ) {
                texture = assets.textureLoader.load(asset, (texture: any) => {
                    resolve(texture);
                });
                assets.textures[ textureCode ] = texture; 
            } else {
                resolve(assets.textures[ textureCode ]);
            }
        });
    }

    public loadSound(asset: string, sound?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sound) { // if passed a positional audio node
                if (this.audioBuffers[ asset ] == null) {
                    this.audioLoader.load( asset, (buffer: any) => {
                         sound.setBuffer( buffer );
                         resolve(sound);
                    });
                 } else {
                     sound.setBuffer( this.audioBuffers[ asset ] );
                     resolve(sound);
                 }
            } else {
                if (this.audioElements[ asset ] == null) {
                    let elem = this.makeAudioElement({asset});

                    elem.onload = () => {
                        resolve(elem);
                    };
                } else {
                    resolve(this.audioElements[asset]);
                }
            }
        });
    }

    public loadVideo(asset: string): Promise<any> {
        let elem = document.createElement("video")

        elem.src = asset;
        return new Promise((resolve, reject) => {
            elem.onload = () => {
                resolve(elem);
            };
        });
    }

    public loadModel(asset: string) { // use obj and fbx systems
        let systems = this.world.systems,
            obj = systems.obj,
            fbx = systems.fbx

        // implement
        // check format from file extension
        // use apattrriate loader..
        // fire callback
    }

    public loadShaders(vertex_url: string, fragment_url: string, onLoad: Function, onProgress: Function, onError: Function ) { // based off http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
		var vertex_loader = new THREE.FileLoader()//THREE.XHRLoader(THREE.DefaultLoadingManager)

		vertex_loader.setResponseType('text')
		vertex_loader.load( vertex_url, (vertex_text: any) => {

			var fragment_loader = new THREE.FileLoader();
			fragment_loader.setResponseType('text')
			fragment_loader.load( fragment_url, (fragment_text: any) => {
				onLoad(vertex_text, fragment_text)
			});

		}, onProgress as any, onError as any)
	}

    public makeAudioElement(attr: any): HTMLAudioElement {
        let element = document.createElement("audio");
        element.setAttribute("src", attr.asset);
        element.setAttribute("autoplay", attr.autoPlay ? "on" : "off");
        element.setAttribute("style", "display: none;");
        document.body.appendChild(element);
        return element;
    }

    getEnvMapFromColor ( r: number, g: number, b: number ) {
        let envURL = '/data/images/photospheres/sky-reflection';

        if ( r !== g && g !== b ) {
            
            if ( g > b ) {
                if ( r > b && g > r /3  ) {
                    envURL = '/data/images/photospheres/sky-reflection-o'
                } else if (g > r && g > b) {
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

    public setSpaces ( spaces: any[] ) {
        this.spaces = spaces
    }

    public setPlaces ( places: any[] ) {
        this.places = places
    }

    public loadInventoryEntity ( username: string, itemId: any): Promise<any> {
        let assets = this
        if (this.loadingItemsById.entities[ itemId ]) { return }
        console.log("continuing to load")
        this.loadingItemsById.entities[ itemId ] = true
         return axios.get(API_SERVER+"/api/inventory/"+username+"/Entities/"+itemId)
                .then((response: any) => {
                    assets.addUserEntities( [ response.data ] )
                    assets.loadingItemsById.entities[ itemId ] = false
                }).catch((response: any) => {
                   console.error(response)
                })
    }

    public loadInventoryComponent ( username: string, itemId: any ): Promise<any> {
        let assets = this
        if (this.loadingItemsById.components[ itemId ]) { return }
        this.loadingItemsById.components[ itemId ] = true
         return axios.get(API_SERVER+"/api/inventory/"+username+"/Components/"+itemId)
                .then((response: any) => {
                    assets.addUserComponents( [ response.data ] )
                    assets.loadingItemsById.components[ itemId ] = false
                }).catch((response: any) => {
                    console.error(response)
                })
    }

    public isEntityLoaded ( entityName: string ) {
        let found = false
        
        if ( this.entitiesByName[ entityName ] != null ) {
            found = true
        }
        if ( this.userEntitiesByName[ entityName ] != null ) {
            found = true
        }
        return found
    }

    public addUserEntities ( entities: any[]) {
        let assets = this
        entities.map( ent => {
            assets.userEntitiesByName[ ent.name ] = ent
        })
        this.userEntities = this.userEntities.concat( entities )
    }

    public addUserComponents ( components: any[]) {
        let assets = this
        components.map( comp => {
            assets.userComponentsByName[ comp.name ] = comp
        })
        this.userComponents = this.userComponents.concat( components )
    }

    public addUserProperties ( attrerties: any[]) {
        this.userProperties = this.userProperties.concat( attrerties )
    }

    public addUserAssets ( assets: any[]) {
        
    }

    public setUserFiles ( files: any[]) {
        this.files = files
    }

    public addUserFiles ( files: any[]) {
        this.files = this.files.concat( files )
    }

    public setUserDirectories ( directories: any[]) {
        this.directories = directories
    }

    public addUserDirectories ( directories: any[]) {
        this.directories = this.directories.concat( directories )
    }

    public makeEntity( name: string, init: boolean, config: any, voxel: number[] ): Entity | DBEntity {

        let builtIn = this.entitiesByName,
            library = builtIn[ name ] != null ? builtIn : this.userEntitiesByName,
            toMake = library[ name ],
            ent: DBEntity = typeof toMake == 'function' ? toMake( this, config, voxel ) : toMake

        if ( init ) {
            return new Entity( ent.id, ent.components, ent.position, ent.quaternion, voxel );
        } else {
            return { ...ent, voxel } as DBEntity;
        }
    }

    public makeComponent( name: string, data: any, config?: any) {
        let builtIn = this.componentsByName,
            library = builtIn[ name ] != null ? builtIn : this.userComponentsByName

        if ( data ) {
            return { ...library[ name ], ...data }
        } else {
            return { ...library[ name ] }
        }
    }

    public getMaterialProp ( name: string ) {
        let attr: any = null
        
        for (const attribute of this.attrs.material.material) { //map(( mat: any, i: number ) => {
            if ( attribute.name == name ) 
                attr = attribute
        }
        if (!attr) {
            for (const attribute of this.attrs.material.color) { //map(( mat: any, i: number ) => {
                if ( attribute.name == name ) 
                    attr = attribute
            }
        }

        return { ...attr }
    }

    public autoEntityID ( ) {
        this.autoDecrementEntity --
        return this.autoDecrementEntity
    }

    private _addBuiltInComponent ( name: string, data: any ) {
        this.components.push(data)
        this.componentsByName[name] = data
    }

    private _addBuiltInEntity ( name: string, data: any ) {
        this.entities.push(data)
        this.entitiesByName[name] = data
    }

    private _initBuiltInComponents ( ) {
        this._addBuiltInComponent("panel", panel1Comp)
        this._addBuiltInComponent("column", column1Comp)
        this._addBuiltInComponent("panel2", panel2Comp)
        this._addBuiltInComponent("column2", column2Comp)
        this._addBuiltInComponent("handle", handle)
        this._addBuiltInComponent("weapon", weapon)
        this._addBuiltInComponent("vehicle", vehicle)
        this._addBuiltInComponent("seat", seat)
    }

    private _initBuiltInEntities ( ) {
        this._addBuiltInEntity( "default-avatar", avatar )
        this._addBuiltInEntity( "hero", hero )
        this._addBuiltInEntity( "tool-menu", toolMenu )
        this._addBuiltInEntity( "help-screen", helpScreen )
        this._addBuiltInEntity( "chat-screen", chatScreen )
        this._addBuiltInEntity( "video-chat", videoChat )
        this._addBuiltInEntity( "panel", panel1 )
        this._addBuiltInEntity( "preview-box", previewBox )
        this._addBuiltInEntity( "panel3", panel3 )
        this._addBuiltInEntity( "block",  block )
        this._addBuiltInEntity( "column1", column1 )
        this._addBuiltInEntity( "wirebox", wirebox )
        this._addBuiltInEntity( "icon", this._initButton() )
        this.initInformationHardware();
        this.initInformationSoftware();
    }

    private initInformationHardware() {
        this.initializeAllInModule("component", HardwareDevices);
        this._addBuiltInEntity( "file-browser", fileBrowser )
        this._addBuiltInEntity( "terminal", terminal )
        this._addBuiltInEntity( "keyboard", keyboard )
        this._addBuiltInEntity( "pointing-device", pointingDevice )
        this._addBuiltInEntity( "printer", printer )
    }

    private initInformationSoftware() {
        this.initializeAllInModule("component", ECSObjects);
        this.initializeAllInModule("component", ASTLiterals);
        this.initializeAllInModule("entity", ASTExpressions);
        this.initializeAllInModule("entity", ASTStatements);
        this._addBuiltInEntity( "builtin-pallet", BuiltinPallet );
        this._addBuiltInEntity( "expression-pallet", ExpressionPallet );
        this._addBuiltInEntity( "literal-pallet", LiteralPallet );
        this._addBuiltInEntity( "statement-pallet", StatementPallet );  
    }

    private initializeAllInModule(type: "component" | "entity", all: AnyObject) {
        if (type == "component") {
            for (const key in all) {
                const add = all[key];
                this._addBuiltInComponent(add.name, add);
            }
        } else if (type == "entity") {
            for (const key in all) {
                const add = all[key];
                this._addBuiltInEntity(add.name, add)
            }
        }
    }

    private _loadPlaces ( places: any[] ) {
        // implement.. call this from redux action
        this.places = places
    }

    private _loadSpaces ( spaces: any[] ) { 
        // implement call this from redux action
        this.spaces = spaces
    }

    private _initButton ( component?: DBComponent, data?: any ) {

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
                quaternion: [0, 0, 0, 1],
                components: [] as Component[]
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
        //         quaternion: [0, 0, 0, 1]
        //     })

        return button
    }

    initIconProps ( color: number, texture: any ) {

        let material: any = {
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