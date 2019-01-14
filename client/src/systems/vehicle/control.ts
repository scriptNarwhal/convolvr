import Convolvr from "../../world/world";
import Component from "../../model/component";
import { SystemDependency } from "..";

export default class ControlSystem {
    public world: Convolvr

    dependencies = [] as SystemDependency[]

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init (component: Component) { 
        let attr = component.attrs.control
        // check if it's a position or orientation control
        
        if ( attr.type == "position" ) {



        } else if ( attr.type == "orientation" ) {


        }

        return {
            
        }
    }
}

