import Component from "../../core/component";
import Convolvr from "../../world/world";
import * as THREE from 'three';
export default class LightSystem {

    private world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init(component: Component) { 

        let attr = component.attrs.light,
            light = null,
            shadowRes = 512,
            world = this.world

        switch (attr.type) {
            case "point":
                light = new THREE.PointLight( attr.color, attr.intensity, attr.distance )
            break
            case "directional":
                light = new THREE.DirectionalLight( attr.color, attr.intensity )
            break
            case "spot":
                light = new THREE.SpotLight( attr.color, attr.intensity )
                if ( world.settings.shadows > 0 ) {
                    shadowRes = 128 * Math.pow(2, world.settings.shadows) / (world.mobile ? 4 : 1) 
                    light.castShadow = true;
                    light.shadow.mapSize.width = shadowRes;
                    light.shadow.mapSize.height = shadowRes;
                    light.shadow.camera.near = 1000;
                    light.shadow.camera.far = attr.distance;
                    light.shadow.camera.fov = 30;
                    light.target = component.mesh
                    light.position.set( 0, 4000, -4000 )
                }
            break
        }

        component.mesh.add(light);

        return {
            light,
            update: ( color: number, intensity: number, distance: number ) => {
                this._update( component,  color, intensity, distance )
            }
        }
    }

    _update ( component: Component, color: number, intensity: number, distance: number ) {

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

 