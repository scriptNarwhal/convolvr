//@flow
import Convolvr from '../../world/world'
import Component from '../../model/component'

export default class EmoteSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) { 
        
        let attr = component.attrs.emote

        //TODO: implement

        return {
            
        }
    }

    use ( component: Component ) {

        let attr = component.attrs.emote
        //TODO: implement
    }

    permutate ( component: Component ) {
        
        let attr = component.attrs.emote
        //TODO: implement
    }

    record ( component: Component ) {
        
        let attr = component.attrs.emote 
        //TODO: implement 
    }
}