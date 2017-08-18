export default class LightSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { 

        let prop = component.props.light,
            light = null,
            shadowRes = 512,
            world = this.world

        switch (prop.type) {
            case "point":
                light = new THREE.PointLight( prop.color, prop.intensity, prop.distance )
            break
            case "directional":
                light = new THREE.DirectionalLight( prop.color, prop.intensity )
            break
            case "spot":
                light = new THREE.SpotLight( prop.color, prop.intensity )
                if ( world.shadows > 0 ) {

                    shadowRes = world.mobile ? 256 : world.shadows > 1 ? 1024 : 512
                    light.castShadow = true;
                    light.shadow.mapSize.width = shadowRes;
                    light.shadow.mapSize.height = shadowRes;
                    light.shadow.camera.near = 1000;
                    light.shadow.camera.far = prop.distance;
                    light.shadow.camera.fov = 30;
                    light.target = component.mesh
                    light.position.set( 0, 2, 1 )
                }

            break
        }

        component.mesh.add(light)

        return {
            light,
            update: ({ color, intensity, distance }) => {
                
                this._update( component, { color, intensity, distance })

            }
        }

    }

    _update ( component, { color, intensity, distance }) {

        let light = component.state.light.light

        if ( color ) {

            light.color.set( color )

        } 

        if ( intensity ) {

            light.intensity = intensity

        }

        if ( distance ) {

            light.distance = distance

        }

    }
}

 