import Component from "../../../model/component";
import Convolvr from "../../../world/world";

export default class FloorSystem {
    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }

    init ( component: Component ) { 
        
        return {
            
        }
    }
}