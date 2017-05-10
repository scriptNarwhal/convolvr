export default class AssetSystem {

    constructor ( world ) {

        this.world = world
        this.geometries = {}
        this.materials = {}
        this.textures = {}
        this.audioBuffers = {}
        this.models = {}
        this.entities = []
        this.components = []
        this.entitiesByName = {}
        this.componentsByName = {}
        this.userEntities = []
        this.userComponents = []
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
                { name: "custom-texture", color: 0xffffff }
            ],
            systems: {
                structures: {
                    floor: {},
                    wall: {},
                    door: {},
                    terrain: {},
                    container: {},
                },
                vehicles: {
                    vehicle: {},
                    control: {},
                    propulsion: {},
                    projectiles: {},
                    portal: {},   
                },
                media: {
                    chat: {},
                    text: {},
                    speech: {},
                    audio: {},
                    video: {},
                    webrtc: {},
                    drawing : {},
                    signal: {}
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
                    cursor: {},
                    hand: {},
                    activate: {},
                    hover: {},
                    tabView: {},
                    tab: {},
                    toolUI: {},
                    tool: {},
                    file: {},
                    rest: {},
                }
            }
        }
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

    loadImage ( asset, callback ) {

        let texture = null

        if (this.textures[asset] == null) {

            texture = this.textureLoader.load(asset, (texture)=>{ callback(texture)})
            this.textures[asset] = texture

        } else {

            texture = this.textures[asset]

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

    loadModel (asset, callback) {

    }

    addUserEntities (entities) {

        this.userEntities = this.userEntities.concat( entities )

    }

    addUserComponents (components) {

        this.userComponents = this.userComponents.concat( components )

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

        this._addBuiltInComponent("panel", {
            props: {
                geometry: {
                merge: true,
                shape: "box",
                size: [42000, 42000, 1500]
                },
                material: {
                color: 0x404040,
                name: "plastic"
                }
            },
            quaternion: null,
            position: [0, 0, 0]
        })

        this._addBuiltInComponent("column", {
            props: {
                geometry: {
                merge: true,
                shape: "hexagon",
                size: [12000, 30000, 12000]
                },
                material: {
                color: 0x404040,
                name: "plastic"
                }
            },
            quaternion: null,
            position: [0, 0, 0]
        })

        this._addBuiltInComponent("panel2", {
            props: {
                geometry: {
                merge: true,
                shape: "box",
                size: [22000, 22000, 1500]
                },
                material: {
                color: 0x404040,
                name: "plastic"
                }
            },
            quaternion: null,
            position: [0, 0, 0]
        })

        this._addBuiltInComponent("column2", {
            props: {
                geometry: {
                merge: true,
                shape: "box",
                size: [8000, 72000, 8000]
                },
                material: {
                color: 0x404040,
                name: "plastic"
                }
            },
            quaternion: null,
            position: [0, 0, 0]
        })

    }

    _initBuiltInEntities ( ) {

        this._addBuiltInEntity( "panel", {
            id: 0,
            components: [
                {
                props: {
                    geometry: {
                    merge: true, //can be combined to save cpu
                    shape: "box",
                    size: [42000, 42000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    },
                    // audio: { // remove this.. merely a test
                    //   asset: "/sounds/Partition.wav[Re-Edit].ogg"
                    // }
                },
                quaternion: null,
                position: [0, 0, 0]
                }, {
                props: {
                    geometry: {
                    merge: true,
                    shape: "box",
                    size: [42000, 42000, 1500]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [-250, -200, 400]
                }
            ],
            position: null,
            quaternion: null
        } )
        
        this._addBuiltInEntity( "panel2", {
            id: 0,
            components: [
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [28000, 28000, 1500]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [-4625, 0, 0]
                },
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "torus",
                    size: [32000, 32000, 15000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [4625, 0, 0]
                },
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [28000, 28000, 1500]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [-10250, 0, 0]
                },
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "cylinder",
                    size: [12000, 18000, 1500]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [10250, 0, 0]
                },
            ],
            position: null,
            quaternion: null
        } )
        
        this._addBuiltInEntity( "panel3", {
            id: 0,
            components: [
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "box",
                    size: [42000, 42000, 4000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [-0, 10250, 0]
                },
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [18000, 28000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [0, 4625, 0]
                },
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "box",
                    size: [10000, 22000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [-0, -10250, 0]
                },
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [28000, 18000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [0, -4625, 0]
                },
            ],
            position: null,
            quaternion: null
        } )

        this._addBuiltInEntity( "block",  {
            id: 0,
            components: [
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "box",
                    size: [42000, 42000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [0, 0, 0]
                }
            ],
            position: null,
            quaternion: null
        } )

        this._addBuiltInEntity( "column", {
            id: 0,
            components: [
                {
                props: {
                    geometry: {
                    merge: true,
                    shape: "box",
                    size: [10000, 22000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [0, 0, 0]
                },{
                props: {
                    geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [16000, 18000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [0, -16000, 0]
                },{
                props: {
                    geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [18000, 18000, 1000]
                    },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                    }
                },
                quaternion: null,
                position: [0, 16000, 0]
                }
            ],
            position: null,
            quaternion: null
        } )

        this._addBuiltInEntity( "wirebox", {
            id: 0,
            components: [
                {
                    props: {
                        geometry: {
                        merge: true,
                        shape: "hexagon",
                        size: [16000, 16000, 1000]
                        },
                        material: {
                        color: 0x808080,
                        name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [0, 0, 0]
                },
                {
                    props: {
                        geometry: {
                        merge: true,
                        shape: "torus",
                        size: [16000, 16000, 1000]
                        },
                        material: {
                        color: 0x808080,
                        name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [0, 0, 0]
                }
            ],
            position: null,
            quaternion: null
        } )

        this._addBuiltInEntity( "icon", {
                id: 0,
                components: this._initButtonComponents(),
                position: null,
                quaternion: null
            }
        )
    
    }

    _initButtonComponents ( data ) {

        let color = data && data.color ? data.color : 0x404040,
            components = [],
            x = 2
      
        components.push({
            props:{
                activates: true,
                gazeOver: true,
                geometry: {
                
                shape: "node",
                size: [0, 0, 0]
                },
                material: {
                name: "plastic",
                color: 0
                }
            },
            position: [0,0,0],
        })
    
        while (x > 0) {

            components.push({
            props: {
                geometry: {
                //merge: true,
                size: [160, 10000, 4000],
                shape: "box"
                },
                material: {
                color: color,
                name: "plastic"
                }
            },
            position: [-5000+(x>1?10000:0), 0, 0],
            quaternion: null
            })
            x --

        }

        x = 2;

        while (x > 0) {

            components.push({
            props: {
                geometry: {
                //merge: true,
                size: [10000, 160, 4000],
                shape: "box"
                },
                material: {
                color: color,
                name: "plastic"
                }
            },
            position: [0, -5000+(x>1?10000:0), 0],
            quaternion: null
            })
            x --

        }

        return components
    }

}