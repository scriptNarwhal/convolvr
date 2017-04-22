export default class LightSystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        let prop = component.props.light,
            light = null

        switch (prop.type) {
            case "point":

            break
            case "directional":

            break
        }

        return {
            light
        }
    }
}

