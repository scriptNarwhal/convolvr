export default class SignalSystem { // system for passing signals between entities

    constructor (world) {

        this.world = world

    }

    init ( component ) { 

        let prop = component.props.signal
        
        if (prop.wire == true) {
            // pass the signal along.. no modulation
        }

        // implement
        
        return {
            
        }

    }
}

