export default class MiniatureSystem {

    constructor ( world ) {

        this.world = world
    }


    init ( component ) { 

        let prop = component.props.miniature

        if ( !!! prop) {

            return

        }

        if ( !!!prop.fullSize ) {
            
            setTimeout(()=>{
                
                this.miniaturize( component, false, prop.scale )
                
            }, 500)
            
        }

        component.props.miniature = undefined // destroy this, since it gives the other components cancer ☠️

        return {
            fullSize: false,
            miniaturize: ( component, revert, scale ) => {

                this.miniaturize( component, revert, scale )

            }
        }
        
    }

    miniaturize ( component, revert, finalScale ) {

            let scale = 1

            if ( !!! component.entity || !!! component.entity.mesh )

                return


            scale = 1 / ( component.entity.boundingRadius / ( finalScale || 0.5 ) )

            if ( !! revert ) {

                component.entity.mesh.scale.set( 1, 1, 1 )

            } else {

                component.entity.mesh.scale.set( scale, scale, scale )

            }

            component.entity.mesh.updateMatrix()

    }

}

