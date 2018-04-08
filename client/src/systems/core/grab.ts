import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class GrabSystem { // respond to grab / drag events / register callbacks
    
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

    // move logic for picking up entity here


    
}