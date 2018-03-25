import Component from "../../core/component";
import Convolvr from "../../world/world";

export default class SkillSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }
    
        init(component: Component) {
            
            let attr = component.attrs.skill,
                state = {}
    
            //TODO: implement
    
            return state
    
        }
    }