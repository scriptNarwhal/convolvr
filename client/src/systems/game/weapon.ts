import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class WeaponSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }
    
        init(component: Component) {
            
            let attr = component.attrs.weapon,
                state = {}
    
            //TODO: implement
    
            return state
    
        }
    }