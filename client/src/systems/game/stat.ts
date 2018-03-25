import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class StatSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }
        init(component: Component) {
            
            let attr = component.attrs.stat,
                state = {}
    
            //TODO: implement
    
            return state
    
        }
    }