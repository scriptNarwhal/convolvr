export default class PropulsionSystem {

    constructor (world) {
        this.world = world
    }

    init (component) { 
        let attr = component.attrs.propulsion
        // use in conjunction with entity physics
        
        return {
            velocity: [0, 0, 0],
            activated: 0,
            thrust: (power) => {
                this.thrust(component, power)
            }
        }
    }

    thrust (component, power) {
        
    }
    
}

