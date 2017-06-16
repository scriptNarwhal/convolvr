export default class CameraSystem {

    constructor ( world ) {
        
        this.world = world

    }

    init ( component ) { 
        
        let prop = component.props.camera,
            type = prop.type,
            fov = prop.fov || 78,
            viewDistance = this.world.viewDistance,
            camera = new THREE.PerspectiveCamera( fov, 1, 1000+viewDistance*200, 15000000 + viewDistance*600000 )

        return {
            camera,
            viewDistance,
            textureChannel: "", // implement
            update: ( ) => {

                this._update( component )

            }
        }
        
    }

    _update ( component ) {

        // implement

    }
}

