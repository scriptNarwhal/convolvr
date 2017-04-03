export default class Systems {
    constructor (systems)  {
        this.systems = systems
        Object.keys(systems).map(system=> {
            this[system] = systems[system]
        })
    }

    registerComponent (component) {
        let props = component.props
        Object.keys(props).map(prop=>{
            if (this[prop] != null) {
                component.state[prop] = this[prop].init(component)
            }
        })
    }
}