export default class LightSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { 

        let prop = component.props.light,
            light = null

        switch (prop.type) {
            case "point":
                light = new THREE.PointLight( prop.color, prop.intensity, prop.distance )
            break
            case "directional":
                light = new THREE.DirectionalLight( prop.color, prop.intensity )
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

 