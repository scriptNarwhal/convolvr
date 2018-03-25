import Component from "../../core/component";
import Convolvr from "../../world/world";

export default class NPCSystem { // for client side aspects of npcs

    private world: Convolvr;
    
    constructor (world: Convolvr) {
        this.world = world
    }

    init(component: Component) {

        let attr = component.attrs.npc

        
        return {

        }
    }
}