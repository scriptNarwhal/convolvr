import Convolvr from "../../world/world";
import Component from "../../model/component";

export default class TimeSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init(component: Component) { 

        let attr = component.attrs.time

        return {
            open: false,
            setTimeout: ( timeout: number, data: any ) => {
                this.setTimeout( component, timeout, data )
            },
            getTime: () => {
                this.getTime( component )
            }
        }
    }

    setTimeout ( component: Component, timeout: number, data: any ) {
        // implement
    }

    getTime ( component: Component ): number {
        return Date.now(); // hmm
    }

}

