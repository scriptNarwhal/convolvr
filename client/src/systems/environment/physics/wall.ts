import Convolvr from "../../../world/world";
import Component from "../../../model/component";
import { SystemDependency } from "../..";

export default class WallSystem {
    public world: Convolvr

    dependencies = [] as SystemDependency[]
    
    constructor (world: Convolvr) {
        this.world = world
    }

    init (component: Component) { 
        
    }
}

