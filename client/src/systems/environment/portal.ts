import Convolvr from "../../world/world";
import Component from "../../model/component";

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
        let noRedirect = false;

        if ( !!!user ) {
            user = "space" // temporary hack
        }

        if ( !!worldName && worldName != this.world.name ) { // check if its the same world or a new one
            this.world.reload( user, worldName, placeName, coords, noRedirect )
        }

        if ( !!coords ) {

            this.world.three.camera.position.fromArray( [
                coords[0]*42.18181818, 
                coords[1]*36.698181818181816, 
                coords[2]*36.698181818181816
            ] )
			this.world.three.camera.updateMatrix()

        }

        if ( !!placeName ) {

            // look up from loaded placenames
            //  then set camera position*
            // implement

        }
    }
}