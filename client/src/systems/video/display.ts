import Convolvr from '../../world/world'
import Component from '../../model/component'

export default class DisplaySystem {

    public world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init (component: Component ) { 
        
        return {

        }
        
    }
}