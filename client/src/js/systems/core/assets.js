import Entity from '../../entity'
import avatar from '../../assets/entities/avatars/avatar'
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

        this.world               = world
        this.geometries          = {}
        this.materials           = {}
        this.textures            = {}
        this.proceduralTextures  = {}
        this.envMaps             = {
            default: '/data/images/photospheres/sky-reflection.jpg'
        }
        this.audioBuffers        = {}
        this.models              = {}
        this.entities            = []
        this.autoDecrementEntity = -1 // entities loaded from network / db have positive ids
        this.components          = []
        this.entitiesByName      = {}
        this.componentsByName    = {}
        this.userEntities        = []
        this.userComponents      = []
        this.places              = []
        this.worlds              = []
        this.props               = {
            geometry: [
                { shape: 'node', size:          [0.0001, 0.0001, 0.0001]             },
                { shape: 'box', size:           [1, 1, 1 ] },
                { shape: 'plane', size:         [1, 0.5, 1] },
                { shape: 'octahedron', size:    [1.1, 0.5, 0.5,] },
                { shape: 'sphere', size:        [1.1, 0.5, 0.5,] },
                { shape: 'cylinder', size:      [1.1, 1.1, 0.5,] },
                { shape: 'torus', size:         [1.1, 1.1, 0.5,] },
                { shape: 'hexagon', size:       [1.1, 1.1, 0.5,] },
                { shape: 'open-box', size:      [1.1, 1.1, 0.5,] },
                { shape: 'open-clyinder', size: [1, 1, 1] },
                { shape: 'frustum', size:       [0.4, 0.4, 0.4]    }
            ],
            material: [
                { name: "basic",     color: 0xffffff },
                { name: "plastic",   color: 0xffffff },
                { name: "metal",     color: 0xffffff },
                { name: "glass",     color: 0xffffff },
                { name: "wireframe", color: 0xffffff },
                { name: "stars",     color: 0xffffff, basic: true },
                { mixin: true,       color: 0xff0707 },
                { mixin: true,       color: 0x07ff07 },
                { mixin: true,       color: 0x0707ff }
            ],
            assets: [ 
                { path: "/data/images/textures/tiles.png" },
                { path: "/data/images/textures/gplaypattern_@2X.png" }, 
                { path: "/data/images/textures/shattered_@2X.png" },
                { path: "/data/images/textures/terrain1.jpg" }, 
                { path: "/data/images/textures/terrain2.jpg" }, 
                { path: "/data/images/textures/terrain3.jpg" },
                { path: "/data/images/textures/organic.jpg" },
                { path: "/data/images/photospheres/sky-reflection.jpg" }, 
                { path: "/data/images/photospheres/sky-reflection-c.jpg" },
                { path: "/data/images/photospheres/sky-reflection-b.jpg" }, 
                { path: "/data/images/photospheres/sky-reflection-p.jpg" }, 
                { path: "/data/images/photospheres/sky-reflection-g.jpg" }, 
                { path: "/data/images/photospheres/sky-reflection-r.jpg" },  
                { path: "/data/images/photospheres/sky-reflection-o.jpg" }
            ],
            systems: { // load these from ../assets/props eventually
                structures: {
                    floor: [{}],
                    wall: [{}],
                    door: [{}],
                    terrain: [{}],
                    container: [{}]
                },
                tools: {
                    toolUI: [
                        { menu: 1 },
                        { currentTool: true }, // indicator
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
                    vehicle: [{}],
                    control: [{}],
                    propulsion: [
                        { thrust: 0.09 },
                        { thrust: 0.333 }
                    ],
                    projectile: [
                        { type: 'instant' },
                        { type: 'slow', thrust: 0.050 }
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
                    layout: [{}],
                    chat: [{}],
                    text: [{}],
                    speech: [{}],
                    audio: [{}],
                    video: [{}],
                    webrtc: [{}],
                    drawing : [{}],
                    file: [{}],
                    rest: [{}],
                },
                interactivity: {
                    destructable: [{}],
                    particles: [{}],
                    factory: [{}],
                    metaFactory: [{}],
                    input: [ 
                        { type: 'button' },
                        { type: 'keyboard' },
                        { type: 'webcam' },
                        { type: 'speech' }
                    ],
                    signal: [{}],
                    switch: [{}],
                    loop: [{}],
                    memory: [{}],
                    cpu: [{}],
                    ioController: [{}],
                    networkInterface: [{}],
                    driveController: [{}],
                    displayAdapter: [{}],
                    display: [{}],
                    cursor: [{}],
                    hand: [{}],
                    activate: [{}],
                    hover: [{}],
                    miniature: [{}],
                    tabView: [{}],
                    tab: [{}],
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

        // implement
        // check format from file extension
        // use appropriate loader..
        // fire callback
    }

    getEnvMapFromColor ( r, g, b ) {

        let envURL = '/data/images/photospheres/sky-reflection.jpg'

        if ( r !== g && g !== b ) {
            
            if ( g > b ) {
                
                if ( r > b ) {
                    envURL = '/data/images/photospheres/sky-reflection-o.jpg'
                } else if (red < 0.2 && blue < 0.2) {
                    envURL = '/data/images/photospheres/sky-reflection-g.jpg'
                } else {
                    envURL = '/data/images/photospheres/sky-reflection-r.jpg'
                }
                                        
            } else if ( b > r ) {

                if ( r < (b / 6.0) && g >= b-0.5 ) {
                    envURL = '/data/images/photospheres/sky-reflection-c.jpg'
                } else if ( r > (b / 6.0) ) {
                    envURL = '/data/images/photospheres/sky-reflection-p.jpg'
                } else {
                    envURL = '/data/images/photospheres/sky-reflection-b.jpg'
                }

            }

        }

        return envURL

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

    makeEntity ( name,  init, config, voxel  ) {
        
        let toMake = this.entitiesByName[ name ],
            ent = typeof toMake == 'function' ? toMake( this, config, voxel ) : toMake

        if ( init ) {

            return new Entity( ent.id, ent.components, ent.position, ent.quaternion, voxel )

        } else {

            return Object.assign({}, ent, { voxel })

        }

    }

    makeComponent ( name, data, config ) {

        if ( data ) {

            return Object.assign( {}, this.componentsByName[ name ], data )

        } else {

            return Object.assign( {}, this.componentsByName[ name ] )

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
        this._addBuiltInEntity( "video-chat", videoChat )
        this._addBuiltInEntity( "file-browser", fileBrowser )
        this._addBuiltInEntity( "panel", panel1 )
        this._addBuiltInEntity( "preview-box", previewBox )
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

        let color = data && data.color ? data.color : 0x151515,
            components = [],
            button = null,
            x = 2
        
        if ( !!component ) { 

            button = component

        } else {

            button = {
                props: {
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
        //         props: {
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