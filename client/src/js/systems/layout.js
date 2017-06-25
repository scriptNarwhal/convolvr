export default class LayoutSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { 
        
        let prop = component.props.layout

        switch ( prop.type ) {

            case "list":

            break
            case "grid":

            break
            case "isometric":

            break
            case "radial":

            break
            case "tube":

            break
        }

        return {
            type: prop.type
        }
    }
}