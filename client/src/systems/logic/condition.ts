import Convolvr from "../../world/world";
import Component from "../../core/component";
export default class ConditionSystem {

    world: Convolvr
    
    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) {
        let attr = component.attrs.condition,
            state: any = {}

        return state
        
    }
}