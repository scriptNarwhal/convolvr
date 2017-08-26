//@flow
import Convolvr from '../../world/world'
import Component from '../../component'

export default class EmoteSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) { 
        
        let prop = component.props.emote

        //TODO: implement

        return {
            
        }
    }
}