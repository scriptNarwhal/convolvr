export default class TimeSystem {

    constructor ( world ) {
        this.world = world
    }

    init ( component ) { 

        let prop = component.props.time

        return {
            open: false,
            setTimeout: ( timeout, data ) => {
                this.setTimeout( component, timeout, data )
            },
            getTime: () => {
                this.getTime( component )
            }
        }
    }

    setTimeout ( component, timeout, data ) {
        // implement
    }

    getTime ( component ) {

    }

}

