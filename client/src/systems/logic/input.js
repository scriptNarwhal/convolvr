export default class InputSystem {
    
    constructor (world) {
        this.world = world
    }

    init (component) {
        
        let attr = component.attrs.input
        
        if ( attr.button ) {

        } else if ( attr.keyboard ) {

        } else if ( attr.controlStick ) { 
            
        } else if ( attr.webcam ) {

        } else if ( attr.speech ) {
            
        } else if ( attr.authentication ) { // authenticate button / use userId

        }

        return {

        }
    }

}