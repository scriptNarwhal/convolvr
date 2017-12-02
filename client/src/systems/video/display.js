//@flow
import Convolvr from '../../world/world'
import Component from '../../component'

export default class DisplaySystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) { 
        
        return {

        }
        
    }
}