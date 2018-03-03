export default class ObjPluginSystem { // allows use of imported .obj meshes

    constructor ( world ) {

        this.world = world
        this.loader = null

    }

    init ( component ) { 
        
        let attr = component.attrs.obj

        this.loader = this.loader || new THREE.OBJLoader()

        this.loader.load(
			attr.url,
			 obj => {
                component.mesh.add( obj )
                component.state.obj.obj = obj
			}
		);

        return {
           url: attr.url,
           obj: null
        }
        
    }
}