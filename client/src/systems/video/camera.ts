import Convolvr from "../../world/world";
import Component from "../../model/component";

import * as THREE from 'three';

export default class CameraSystem {

    private world: Convolvr;

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
            update: (position: number[], quaternion: number[]) => {

                this._update(component, position, quaternion )

            }
        }
        
    }

    _update (component: Component, position: number[], quaternion: number[]) {
        let camera = component.state.camera.camera

        camera.position.fromArray( position )
        camera.quaternion.fromArray( quaternion )

    }
}

