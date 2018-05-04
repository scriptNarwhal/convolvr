
import Component from '../../core/component.js';
import Convolvr from '../../world/world'

export default class LoopSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init(component: Component) {

        let attr = component.attrs.loop,
            state: any = {}

        return state

    }
}