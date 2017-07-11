export default class ObjSystem { // allows use of imported .obj meshes

    constructor ( world ) {

        this.world = world
        this.loader = null

    }

    init ( component ) { 
        
        let prop = component.props.obj

        this.loader = this.loader || new THREE.OBJLoader()

        this.loader.load(
			prop.url,
			 loadedObj => {
				component.mesh.add( loadedObj )
			}
		);

        return {
           url: prop.url,
           loadedObj
        }
        
    }
}