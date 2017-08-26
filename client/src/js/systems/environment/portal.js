export default class PortalSystem {

    constructor ( world ) {
        this.world = world
    }

    init ( component ) { 
        
        return {
            teleport: () => {

                let config = component.props.portal,
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

    teleport ( component, user, worldName, coords, placeName ) {
        
        if ( !!!user ) {

            user = "space" // temporary hack

        }

        if ( !!world && world != this.world.name ) { // check if its the same world or a new one

            this.world.reload( user, worldName, placeName, coords, noRedirect )

        }

        if ( !!coords ) {

            three.camera.position.fromArray( [
                parseInt(coords[0])*928000, 
                parseInt(coords[1])*807360, 
                parseInt(coords[2])*807360
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