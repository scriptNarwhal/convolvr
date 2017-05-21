export default class PortalSystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        
        return {
            teleport: (world, coords, placeName) => {
                this.teleport(world, coords, placeName)
            }
        }
    }

    teleport (world, coords, placeName) {
        // implement this..
        // check if its the same world or a new one
        
    }
}