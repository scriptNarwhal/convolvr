export default class SignalSystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        let prop = component.props.signal,
            state = {}
        
        if (prop.wire == true) {
            // pass the signal along.. no modulation
        }
        // do stuff with inputs and outputs? 
        // check component.entity inputs / outputs
        
        return state
    }
}

