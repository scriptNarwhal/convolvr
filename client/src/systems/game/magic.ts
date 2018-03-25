import Component from "../../core/component";
import Convolvr from "../../world/world";

export default class MagicSystem {
        private world: Convolvr;
    
        constructor (world: Convolvr) {
            this.world = world
        }
    
        init(component: Component) {
            let attr = component.attrs.magic,
                state = {}
    
            //TODO: implement
    
            return state
        }
    }