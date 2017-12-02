export default class GraphSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) {
        
        let prop = component.props.graph,
            state = {}

        if ( prop.type === "line" ) { // display data as simple line graph

            // use display adapter system
            //TODO: implement

        } else if ( prop.type === "node" ) { // display data as 3d node graph



        } else if ( prop.type === "edge" ) { // display connections between nodes



        }

        return state

    }
}