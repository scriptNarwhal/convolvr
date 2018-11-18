import Convolvr from "../../world/world";
import Component from "../../model/component";
import { System } from "..";
// ActivateSystem exposes behaviors of components that require a trigger to user interaction
export default class ActivateSystem implements System { // respond to activate / click pointer events & register callbacks
    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init (component: Component) {
        let callbacks: Function[] = []

        return {
            callbacks
        }
    }

}