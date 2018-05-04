import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class QuestSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }
    
        init(component: Component) {
            
            let attr = component.attrs.quest,
                state: any = {}
    
            //TODO: implement
    
            return state
    
        }
    }