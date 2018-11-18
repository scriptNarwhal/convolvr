import Convolvr from "../../world/world";
import Component from "../../model/component";

export default class RPGRaceSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }
    init(component: Component) {
            
        let attr = component.attrs.rpgRace,
            state: any = {}
    
        //TODO: implement
    
        return state
    
    }
}