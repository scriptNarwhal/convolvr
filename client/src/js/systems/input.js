export default class InputSystem {
    constructor (world) {
        this.world = world
    }

    init (component) {
        
        let prop = component.props.input
        
        if (prop.button) {

        } else if (prop.keyboard) {

        } else if (prop.controlStick) { 
            
        } else if (prop.webcam) {

        } else if (prop.speech) {
            
        } else if (prop.authentication) { // authenticate button / use userId

        }

        return {

        }
    }

}