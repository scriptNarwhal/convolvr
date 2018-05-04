import Component from '../../core/component.js';
import Convolvr from '../../world/world'

export default class InputSystem {

    world: Convolvr

    constructor (world: Convolvr) {
        this.world = world
    }

    init (component: Component) {
        
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