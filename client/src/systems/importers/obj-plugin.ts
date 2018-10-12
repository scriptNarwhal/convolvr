import Convolvr from "../../world/world";
import Component from "../../core/component";
import * as THREE from 'three';
import { System } from '../index'
export default class ObjPluginSystem implements System { // allows use of imported .obj meshes

    public world: Convolvr
    public loader: any

    constructor ( world: Convolvr ) {
        this.world = world
        this.loader = null
    }

    init(component: Component) { 
        
        let attr = component.attrs.obj

        this.loader = this.loader || new THREE.OBJLoader()

        this.loader.load(
			attr.url,
			 (obj: any) => {
                component.mesh.add( obj )
                component.state.obj.obj = obj
			}
		);

        return {
           url: attr.url,
           obj: null as any
        }
        
    }
}