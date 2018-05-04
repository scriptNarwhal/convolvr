import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class MiniatureSystem {

    private world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }


    init(component: Component) { 

        let attr = component.attrs.miniature

        if ( !!! attr) {
            return
        }

        if ( !!!attr.fullSize ) {
            setTimeout(()=>{
                this.miniaturize( component, false, attr.scale )
            }, 500)
        }

        component.attrs.miniature = undefined // destroy this, since it gives the other components cancer ☠️

        return {
            fullSize: false,
            miniaturize: ( revert: boolean, scale: number ) => {
                this.miniaturize( component, revert, scale )
            }
        }
    }

    miniaturize ( component: Component, revert: boolean, finalScale: number ) {

            let scale = 1

            if ( !!! component.entity || !!! component.entity.mesh )
                return

            scale = 1 / ( component.entity.boundingRadius / ( finalScale || 0.5 ) )

            if ( revert ) {
                component.entity.mesh.scale.set( 1, 1, 1 )
            } else {
                component.entity.mesh.scale.set( scale, scale, scale )
            }

            component.entity.mesh.updateMatrix()
    }
}

