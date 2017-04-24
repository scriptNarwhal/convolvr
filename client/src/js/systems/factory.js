export default class FactorySystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        let prop = component.props.factory

        return {
            generate: () => {
                this.generate() // presumably
            }
        }
    }

    generate () {

    }
}

