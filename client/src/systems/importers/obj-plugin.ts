import Convolvr from "../../world/world";
import Component from "../../core/component";
const THREE = (window as any).THREE;
export default class ObjPluginSystem { // allows use of imported .obj meshes

    private world: Convolvr
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