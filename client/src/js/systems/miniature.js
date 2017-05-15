export default class MiniatureSystem {

    constructor (world) {

        this.world = world
    }


    init (component) { 

        let prop = component.props.miniature

        if ( prop.fullSize !== true ) {
            
            setTimeout(()=>{
                
                component.entity.mesh.scale.set(0.25, 0.25, 0.25)
                
            }, 500)

        }

        return {
            fullSize: false,
            toggle: () => {

                let state = component.state.miniature

                state.fullSize = !state.fullSize

                if ( state.fullSize ) {

                    component.entity.mesh.scale.set(1, 1, 1)

                } else {

                    component.entity.mesh.scale.set(0.25, 0.25, 0.25)

                }

            }
        }
        
    }

}

