import Component from "../../model/component";
import Convolvr from "../../world/world";
import { SystemDependency } from "..";

export default class ConveyorSystem {
    public world: Convolvr

    dependencies = [] as SystemDependency[]
    constructor (world: Convolvr) {
        this.world = world
    }

    init (component: Component) { 
        let attr = component.attrs.propulsion
        // use in conjunction with entity physics
        
        return {
            velocity: [0, 0, 0],
            activated: 0,
            thrust: (power: number) => {
                this.thrust(component, power)
            }
        }
    }

    thrust (component: Component, power: number) {
        
    }
}

