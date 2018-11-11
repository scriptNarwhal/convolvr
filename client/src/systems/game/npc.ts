import Component from "../../model/component";
import Convolvr from "../../world/world";
import { SystemDependency } from "..";
import ScriptSystem from "../logic/script";
import { npc } from "../../model/attribute";

export default class NPCSystem { // for client side aspects of npcs

    private world: Convolvr;
    dependencies: SystemDependency[] = [["script"]]
    
    private script: ScriptSystem

    constructor (world: Convolvr) {
        this.world = world
    }

    init(component: Component) {
        let attr: npc = component.attrs.npc
        
        
        return {

        }
    }
}