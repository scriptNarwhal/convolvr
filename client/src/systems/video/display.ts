import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class DisplaySystem {

    private world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init (component: Component ) { 
        
        return {

        }
        
    }
}