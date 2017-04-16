export default class Systems {
    constructor (systems)  {
        this.systems = systems
        Object.keys(systems).map(system=> {
            this[system] = systems[system]
        })
    }

    registerComponent (component) {
        let componentsByProp = component.entity.componentsByProp,
            props = component.props,
            state = component.state,
            deferredSystems = [],
            mesh = null

        Object.keys(props).map(prop=> {
            if (this[prop] != null) {
                if (prop=="text") { /* add other systems here */
                    deferredSystems.push(prop)
                } else {
                    state[prop] = this[prop].init(component)
                    if (componentsByProp[prop] == undefined) {
                        componentsByProp[prop] = []
                    } 
                    componentsByProp[prop].push(component)
                }
            }
        })
        
        mesh = new THREE.Mesh(state.geometry.geometry, state.material.material)
        mesh.matrixAutoUpdate = false
        component.mesh = mesh

        deferredSystems.map(prop=>{
            state[prop] = this[prop].init(component)
        })

        return mesh
    }
}