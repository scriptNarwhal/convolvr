import Entity from '../entity'

import avatar from '../assets/avatars/avatar'
import toolMenu from '../assets/entities/tool-menu'
import helpScreen from '../assets/entities/help-screen'
import chatScreen from '../assets/entities/chat-screen'
import panel1 from '../assets/entities/panel-1'
import panel2 from '../assets/entities/panel-2'
import panel3 from '../assets/entities/panel-3'
import block from '../assets/entities/block'
import column1 from '../assets/entities/column-1'
import wirebox from '../assets/entities/wirebox'
import panel1Comp from '../assets/components/panel-1'
import column1Comp from '../assets/components/column-1'
import panel2Comp from '../assets/components/panel-2'
import column2Comp from '../assets/components/column-2'

export default class AssetSystem {

    constructor ( world ) {

        this.world = world
        this.geometries = {}
        this.materials = {}
        this.textures = {}
        this.audioBuffers = {}
        this.models = {}
        this.entities = []
        this.autoDecrementEntity = -1 // entities loaded from network / db have positive ids
        this.components = []
        this.entitiesByName = {}
        this.componentsByName = {}
        this.userEntities = []
        this.userComponents = []
        this.places = []
        this.worlds = []
        this.props = {
            geometry: [
                { shape: 'node', size: [1, 1, 1] },
                { shape: 'box', size: [28000, 28000, 28000] },
                { shape: 'plane', size: [28000, 10000, 28000] },
                { shape: 'octahedron', size: [28000, 10000, 10000] },
                { shape: 'sphere', size: [28000, 10000, 10000] },
                { shape: 'cylinder', size: [28000, 28000, 10000] },
                { shape: 'torus', size: [28000, 28000, 10000] },
                { shape: 'hexagon', size: [28000, 28000, 10000] },
                { shape: 'open-box', size: [28000, 28000, 10000] }
            ],
            material: [
                { name: "basic", color: 0xffffff },
                { name: "plastic", color: 0xffffff },
                { name: "metal", color: 0xffffff },
                { name: "glass", color: 0xffffff },
                { name: "wireframe", color: 0xffffff },
                { name: "custom-texture", color: 0xffffff },
                { mixin: true, color: 0xff0707 },
                { mixin: true, color: 0x07ff07 },
                { mixin: true, color: 0x0707ff }
            ],
            assets: [ 
                    { path: "/data/images/textures/sky-reflection.jpg" }, 
                    { path: "/data/images/textures/gplaypattern_@2X.png" }, 
                    { path: "/data/images/textures/shattered_@2X.png" } 
            ],
            systems: { // load these from ../assets/props eventually
                structures: {
                    floor: {},
                    wall: {},
                    door: {},
                    terrain: {},
                    container: {},
                },
                tools: {
                    toolUI: [
                        { menu: 1 },
                        { currentToolLabel: "Custom Tool" },
                        { toolIndex: 0 },
                        { toolIndex: 1 },
                        { toolIndex: 2 },
                        { toolIndex: 3 },
                        { toolIndex: 4 },
                        { toolIndex: 5 }
                    ],
                    tool: [
                        // tool templates
                    ],
                    
                },
                vehicles: {
                    vehicle: {},
                    control: {},
                    propulsion: [
                        { thrust: 2000 },
                        { thrust: 8000 }
                    ],
                    projectile: [
                        { type: 'instant' },
                        { type: 'slow', thrust: 12000 }
                    ],
                    portal: [
                        { newPlace: true },
                        { newWorld: true },
                        { coords: [0, 0, 0] },
                        { worldName: "" },
                        { place: "" },
                        { domain: "" }
                    ]   
                },
                media: {
                    chat: {},
                    text: {},
                    speech: {},
                    audio: {},
                    video: {},
                    webrtc: {},
                    drawing : {},
                    file: {},
                    rest: {},
                },
                interactivity: {
                    destructable: {},
                    particles: {},
                    factory: {},
                    metaFactory: {},
                    input: [ 
                        { type: 'button' },
                        { type: 'keyboard' },
                        { type: 'webcam' },
                        { type: 'speech' }
                    ],
                    signal: {},
                    cursor: {},
                    hand: {},
                    activate: {},
                    hover: {},
                    miniature: {},
                    tabView: {},
                    tab: {},
                }
            }
        }

        this.files = [] // user's files; separate from entity file systems
        this.directories = [] // user's directories
        
        this.textureLoader = new THREE.TextureLoader()
        this.audioLoader = new THREE.AudioLoader()
        this._initBuiltInEntities()
        this._initBuiltInComponents()

    }

    init ( component ) { 

        let prop = component.props.assets

        return {
            
        }

    }

    loadImage ( asset, config, callback ) {

        let texture = null,
            configCode = !!config.repeat ? `:repeat:${config.repeat.join('.')}` : '',
            textureCode = `${asset}:${configCode}`

        if ( this.textures[textureCode] == null ) {

            texture = this.textureLoader.load(asset, (texture)=>{ callback(texture)})
            this.textures[textureCode] = texture

        } else {

            texture = this.textures[textureCode]

        }

        callback( texture )

    }

    loadSound ( asset, sound, callback ) {

        if (this.audioBuffers[asset] == null) {

           this.audioLoader.load(asset, function(buffer) {
                sound.setBuffer(buffer)
                callback()
           })

        } else {

            sound.setBuffer( this.audioBuffers[asset] )
            callback()

        }

    }

    loadModel ( asset, callback ) {

        // implement
        // check format from file extension
        // use appropriate loader..
        // fire callback
    }

    setWorlds ( worlds ) {

        this.world = worlds

    }

    setPlaces ( places ) {

        this.places = places

    }

    addUserEntities ( entities ) {

        this.userEntities = this.userEntities.concat( entities )

    }

    addUserComponents ( components ) {

        this.userComponents = this.userComponents.concat( components )

    }

    addUserAssets ( assets ) {

        this.systems.asset = this.systems.asset.concat( assets )

    }

    setUserFiles ( files ) {

        this.files = files

    }

    setUserDirectories ( directories ) {

        this.directories = directories

    }

    makeEntity ( name, init, config ) {
        
        let toMake = this.entitiesByName[name],
            ent = null //Object.assign({}, this.entitiesByName[name])

        if ( typeof toMake == 'function' ) {

            ent =  toMake( this, config )

        } else {

            ent = toMake

        }

        if ( !!init ) {

            return new Entity( ent.id, ent.components, ent.position, ent.quaternion)
        
        } else {

            return ent
        
        }

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
        this._addBuiltInEntity( "tool-menu", toolMenu )
        this._addBuiltInEntity( "help-screen", helpScreen )
        this._addBuiltInEntity( "chat-screen", chatScreen )
        this._addBuiltInEntity( "panel", panel1 )
        this._addBuiltInEntity( "panel2", panel2 )
        this._addBuiltInEntity( "panel3", panel3 )
        this._addBuiltInEntity( "block",  block )
        this._addBuiltInEntity( "column", column1 )
        this._addBuiltInEntity( "wirebox", wirebox )
        this._addBuiltInEntity( "icon", this._initButton() )

    }

    _loadPlaces ( places ) {
        // implement.. call this from redux action
        this.places = places
        
    }

    _loadWorlds ( worlds ) { 
        // implement call this from redux action
        this.worlds = worlds

    }

    _initButton ( component, data ) {

        let color = data && data.color ? data.color : 0x252525,
            components = [],
            button = null,
            x = 2
        
        if ( !!component ) { 

            button = component

        } else {

            button = {
                props: {
                    activates: true,
                    gazeOver: true,
                    geometry: {
                        merge: true,
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
    
        while ( x > 0 ) {

            button.components.push({
                props: {
                    geometry: {
                        merge: true,
                        size: [ 320, 10000, 4000 ],
                        shape: "box"
                    },
                    material: {
                        color: color,
                        name: "plastic"
                    }
                },
                position: [ -5000+( x > 1 ? 10000 : 0), 0, 0 ],
                quaternion: null
            })
            x --

        }

        x = 2

        while ( x > 0 ) {

            button.components.push({
                props: {
                    geometry: {
                        merge: true,
                        size: [ 10000, 320, 4000 ],
                        shape: "box"
                    },
                    material: {
                        color: color,
                        name: "plastic"
                    }
                },
                position: [ 0, -5000+( x > 1 ? 10000 : 0), 0 ],
                quaternion: null
            })
            x --

        }

        return button
    }

    _initIconProps ( color ) {

        return {
            material: {
                name: "metal",
                color
            },
            geometry: {
                shape: "box",
                size: [ 6000, 6000, 6000 ]
            }
        }
    }

}