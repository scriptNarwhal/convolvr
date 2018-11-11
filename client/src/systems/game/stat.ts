import Convolvr from "../../world/world";
import Component from "../../model/component";

export default class StatSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }
        init(component: Component) {
            
            let attr = component.attrs.stat,
                state: any = {}
    
            //TODO: implement
    
            return state
    
        }
    }