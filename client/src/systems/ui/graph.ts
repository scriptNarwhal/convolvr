import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class GraphSystem {
    private world: Convolvr;

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init(component: Component) {
        
        let attr = component.attrs.graph,
            state: any = {}

        if ( attr.type === "line" ) { // display data as simple line graph
            // use display adapter system
            //TODO: implement
        } else if ( attr.type === "node" ) { // display data as 3d node graph


        } else if ( attr.type === "edge" ) { // display connections between nodes


        }

        return state
    }
}