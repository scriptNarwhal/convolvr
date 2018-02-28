export default class GraphSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) {
        
        let attr = component.attrs.graph,
            state = {}

        if ( attr.type === "line" ) { // display data as simple line graph

            // use display adapter system
            //TODO: implement

        } else if ( attr.type === "node" ) { // display data as 3d node graph



        } else if ( attr.type === "edge" ) { // display connections between nodes



        }

        return state

    }
}