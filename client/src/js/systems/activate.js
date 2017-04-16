export default class ActivateSystem { // respond to activate / click pointer events & register callbacks
    constructor (world) {
        this.world = world
    }

    init (component) {
        let callbacks = []

        return {
            callbacks
        }
    }
}