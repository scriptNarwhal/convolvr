export default class DestructableSystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        // break apart sub components
        return {
            explodeProgress: 0
        }
    }
}

