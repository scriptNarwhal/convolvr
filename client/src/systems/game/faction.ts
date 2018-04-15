import Convolvr from "../../world/world";
import Component from "../../core/component";


export default class FactionSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }
    
    init(component: Component) {
            
        let attr = component.attrs.faction,
            state: any = {}
    
        //TODO: implement
    
        return state
    }
}