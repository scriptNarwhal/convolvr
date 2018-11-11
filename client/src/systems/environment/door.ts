//@flow
import Convolvr from '../../world/world'
import Component from '../../model/component'

export default class DoorSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) { 

        let attr = component.attrs.door

        return {
            open: false,
            toggle: ( open: boolean ) => {

            }
        }

    }
}

