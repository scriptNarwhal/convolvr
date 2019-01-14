import Convolvr from "../../world/world";
import Component from "../../model/component";
import { System, SystemDependency } from "..";

export default class GrabSystem implements System { // respond to grab / drag events / register callbacks
    world: Convolvr

    dependencies = [] as SystemDependency[]
    
    constructor (world: Convolvr) {
        this.world = world

    }

    init(component: Component) {
        let callbacks: Function[] = []

        return {
            callbacks
        }
    }

    // move logic for picking up entity here

    // also handle scrolling here

    // check if grab attr is present in grabbed component and then defer to callback if `scrollable` or some other action is specified
    
}