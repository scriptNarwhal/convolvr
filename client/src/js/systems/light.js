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
            light
        }

    }
}

