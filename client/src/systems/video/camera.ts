export default class CameraSystem {

    constructor ( world: Convolvr ) {
        
        this.world = world

    }

    init ( component: Component ) { 
        
        let attr = component.attrs.camera,
            type = attr.type,
            fov = attr.fov || 78,
            viewDistance = this.world.settings.viewDistance,
            camera = new THREE.PerspectiveCamera( fov, 1, 1000+viewDistance*200, 15000000 + viewDistance*600000 )

        return {
            camera,
            viewDistance,
            textureChannel: "", // implement
            update: ( position, quaternion  ) => {

                this._update( component, position, quaternion  )

            }
        }
        
    }

    _update ( component, position, quaternion ) {

        let camera = component.state.camera.camera

        camera.position.fromArray( position )
        camera.quaternion.fromArray( quaternion )

    }
}

