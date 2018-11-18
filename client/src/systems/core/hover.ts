import Convolvr from "../../world/world";
import Component from "../../model/component";
import { System } from "..";

export default class HoverSystem implements System { // respond to hover pointer events / register callbacks
    world: Convolvr

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