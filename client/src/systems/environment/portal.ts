import Convolvr from "../../world/world";

export default class PortalSystem {

    private world: Convolvr

    constructor(world: Convolvr) {
        this.world = world
    }

    init(component: Component) { 
        
        return {
            teleport: () => {

                let config = component.attrs.portal,
                    state = component.state.portal,
                    user = config.user,
                    worldName = config.world,
                    coords = config.coords, 
                    placeName = config.placeName

                this.teleport(component, user, worldName, coords, placeName)
                state.timesUsed ++
            },
            timesUsed: 0
        }
    }

    teleport (component: Component, user: string, worldName: string, coords: number[], placeName: string) {
        
        if ( !!!user ) {

            user = "space" // temporary hack

        }

        if ( !!world && world != this.world.name ) { // check if its the same world or a new one

            this.world.reload( user, worldName, placeName, coords, noRedirect )

        }

        if ( !!coords ) {

            three.camera.position.fromArray( [
                parseInt(coords[0])*42.18181818, 
                parseInt(coords[1])*36.698181818181816, 
                parseInt(coords[2])*36.698181818181816
            ] )
			three.camera.updateMatrix()

        }

        if ( !!placename ) {

            // look up from loaded placenames
            //  then set camera position*
            // implement

        }
    }
}