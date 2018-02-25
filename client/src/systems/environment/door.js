//@flow
import Convolvr from '../../world/world'
import Component from '../../core/component'

export default class DoorSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) { 

        let prop = component.props.door

        return {
            open: false,
            toggle: ( open: boolean ) => {

            }
        }

    }
}

