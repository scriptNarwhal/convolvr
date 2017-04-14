export default class AssetSystem {
    constructor (world) {
        this.world = world
        this.textures = []
        this.models = []
        this.entities = []
        this.components = []
        this.geometries = {}
        this.materials = {}
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
            systems: [

            ]
        }
    }

    init (component) { 
        let prop = component.props.assets,
            state = {}

        return state
    }

    load (resource) {

    }
}

