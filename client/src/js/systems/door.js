export default class DoorSystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        let prop = component.props.door
        return {
            open: false,
            toggle: (open) => {

            }
        }
    }
}

