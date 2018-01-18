//@flow
import Convolvr from '../../world/world'
import Component from '../../component'

export default class VirtualDeviceSystem { // renders graphics to canvas via 2d api or glsl
    
    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
        
    }

    init ( component: Component ) {

        // create a canvas, save the context, etc
        // implement
       

        return {
            getOutput: () => {

            },
            clear: () => {
                
            }
        }

    }
    
    configure ( data: Object ) {

        // implement 

    }

   
}