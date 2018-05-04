
import Component from '../../core/component.js';
import Convolvr from '../../world/world'

export default class MethodSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init(component: Component) {
        
        let attr = component.attrs.methods,
            state: any = {}

        //TODO: implement

        return state

    }
}