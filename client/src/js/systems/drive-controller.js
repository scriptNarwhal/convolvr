export default class DriveControllerSystem {

    constructor (world) {

        this.world = world
        
    }

    init (component) {
        
        let prop = component.props.driveController,
            fs = this.world.systems.file

        // use file system.. take into account user, world, cell, entityId for storage directory

        return {

        }
    }

}