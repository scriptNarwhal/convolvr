export default class AssetSystem {
    constructor (world) {
        this.world = world
        this.models = []
        this.entities = []
        this.components = []
        this.geometries = {}
        this.materials = {}
        this.textures = {}
        this.audioBuffers = {}
        this.props = {
            geometry: [
                {shape: 'node', size: [1, 1, 1]},
                {shape: 'box', size: [10000, 10000, 10000]},
                {shape: 'plane', size: [10000, 10000, 10000]},
                {shape: 'octahedron', size: [10000, 10000, 10000]},
                {shape: 'sphere', size: [10000, 10000, 10000]},
                {shape: 'cylinder', size: [10000, 10000, 10000]},
                {shape: 'torus', size: [10000, 10000, 10000]},
                {shape: 'hexagon', size: [10000, 10000, 10000]},
                {shape: 'open-box', size: [10000, 10000, 10000]}
            ],
            material: [
                {name: "basic", color: 0xffffff},
                {name: "plastic", color: 0xffffff},
                {name: "metal", color: 0xffffff},
                {name: "glass", color: 0xffffff},
                {name: "wireframe", color: 0xffffff},
                {name: "custom-texture", color: 0xffffff}
            ],
            systems: [ // categorize this some how
                {name: 'vehicle'},
                {name: 'floor'},
                {name: 'wall'},
                {name: 'text'},
                {name: 'audio'},
                {name: 'video'},
                {name: 'signal'},
                {name: 'drawing'},
                {name: 'control'},
                {name: 'propulsion'},
                {name: 'factory'},
                {name: 'metaFactory'},
                {name: 'particles'},
                {name: 'projectiles'},
                {name: 'destructable'},
                {name: 'door'},
                {name: 'cursor'},
                {name: 'hand'},
                {name: 'hover'},
                {name: 'activate'},
                {name: 'terrain'},
                {name: 'container'},
                {name: 'tab'},
                {name: 'tabView'},
                {name: 'toolUI'},
                {name: 'tool'},
                {name: 'webhook'},
                {name: 'webrtc'},
                {name: 'file'},
                {name: 'chat'}
            ]
        }
        this.textureLoader = new THREE.TextureLoader()
        this.audioLoader = new THREE.AudioLoader()
    }

    init (component) { 
        let prop = component.props.assets

        return {
            
        }
    }

    loadImage (asset, callback) {
        let texture = null

        if (this.textures[asset] == null) {
            texture = this.textureLoader.load(asset, (texture)=>{ callback(texture)})
            this.textures[asset] = texture
        } else {
            texture = this.textures[asset]
        }
        callback(texture)
    }

    loadSound (asset, sound, callback) {
        let sound = null

        if (this.audioBuffers[asset] == null) {
           loader.load( asset, function( buffer ) {
                sound.setBuffer( buffer )
            })
        } else {
            sound.setBuffer(this.audioBuffers[asset])
        }
        callback()
    }

    loadModel (asset, callback) {

    }
}

