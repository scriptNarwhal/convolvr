import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class LookAwaySystem { // respond to hover pointer events / register callbacks
    
    private world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
    }

    init(component: Component) {

        let callbacks: Function[] = []

        return {
            callbacks
        }

    }
}