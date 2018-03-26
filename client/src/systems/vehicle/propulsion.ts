import Component from "../../core/component";
import Convolvr from "../../world/world";

export default class PropulsionSystem {

    private world: Convolvr

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

