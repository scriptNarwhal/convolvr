export default class ActivateSystem { // respond to activate / click pointer events & register callbacks
    
    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) {

        let callbacks = []

        return {
            callbacks
        }

    }

}