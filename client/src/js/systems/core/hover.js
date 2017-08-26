export default class HoverSystem { // respond to hover pointer events / register callbacks
    
    constructor ( world ) {

        this.world = world
    }

    init ( component ) {

        let callbacks = []

        return {
            callbacks
        }

    }
}