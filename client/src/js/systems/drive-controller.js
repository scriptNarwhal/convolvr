//@flow
import Convolvr from '../world/world'
import Component from '../component'

export default class DriveControllerSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
        
    }

    init ( component: Component ) {
        
        let prop = component.props.driveController,
            fs = this.world.systems.file

        // use file system (or remote storage if the server if configured for it)
        // .. take into account user, world, cell, entityId for storage directory

        return {

        }
    }

}