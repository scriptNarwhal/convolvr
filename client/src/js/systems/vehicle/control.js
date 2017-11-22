export default class ControlSystem {

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) { 
        
        let prop = component.props.control
        // check if it's a position or orientation control
        
        if ( prop.type == "position" ) {



        } else if ( prop.type == "orientation" ) {


        }

        return {
            
        }
    }
}

