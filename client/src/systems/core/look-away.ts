export default class LookAwaySystem { // respond to hover pointer events / register callbacks
    
    constructor ( world ) {

        this.world = world
    }

    init(component: Component) {

        let callbacks = []

        return {
            callbacks
        }

    }
}