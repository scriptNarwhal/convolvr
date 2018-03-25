export default class ControlSystem {

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) { 
        
        let attr = component.attrs.control
        // check if it's a position or orientation control
        
        if ( attr.type == "position" ) {



        } else if ( attr.type == "orientation" ) {


        }

        return {
            
        }
    }
}

