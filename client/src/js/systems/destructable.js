//@flow
import Convolvr from '../world/world'
import Component from '../component'

export default class DestructableSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
        
    }

    init ( component: Component ) { 
        // break apart sub components
        return {
            explodeProgress: 0
        }
    }

}

