import Convolvr from "../../world/world";
import Component from "../../model/component";
import { SystemDependency } from "..";

export default class AbilitySystem {
    public world: Convolvr

    dependencies = [] as SystemDependency[]
    
    constructor (world: Convolvr ) {
        this.world = world
    } 
    
        init(component: Component) {
            
            let attr = component.attrs.ability,
                state: any = {}
    
            //TODO: implement
    
            return state
    
        }
    }