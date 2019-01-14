//@flow
import Convolvr from '../../world/world'
import Component from '../../model/component'
import { SystemDependency } from '..';

export default class DoorSystem {
    public world: Convolvr

    dependencies = [] as SystemDependency[]

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

