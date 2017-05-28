import Entity from '../entity'

let physics = null

export default class Voxel {

    constructor (data, cell) { // this should be refactored to use the terrain system

        let visible = data.visible,
            voxelGeom = null,
            world = three.world,
            altitude = 0,
            gridSize = 264000 / 16,
            narrow = gridSize * 0.87,
            mesh = null,
            geom = null, //new THREE.CylinderGeometry(532000, 532000, 835664, 6, 1),
            mat = null,
            x = 8
            

        let component = {
            props: {
                geometry: {
                    shape: "hexagon",
                    size: [ 538000, 538000, 835664 ]
                },
                material: {
                    name: "terrain",
                    color: data.color
                }
            }
        }
        geom = world.systems.geometry.init(component).geometry // benefit from geometry caching
        mat = world.systems.material.init(component).material

        this.entities = []
        physics = world.systems.worldPhysics.worker

        if (data == null) {
            data = { }
        }
      
        mesh = new THREE.Mesh(geom, mat)
        mesh.matrixAutoUpdate = false

        if ( visible == false ) {
            mesh.visible = false
        }

        this.mesh = mesh

        if ( !!data.entities ) {

          data.entities.map(e => {
            let entity = new Entity(e.id, e.components, e.position, e.quaternion)
            this.entities.push(entity) // init later
          })

        }

        altitude = data.altitude || 0

        if ( !! cell ) {

            mesh.position.set((cell[0]*928000) + (cell[2] % 2 == 0 ? 0 : 928000 / 2),
                               altitude + (cell[1]*928000) - 528000,
                               cell[2]*807360);
            data.cell = cell;
            data.position = [
                mesh.position.x,
                mesh.position.y,
                mesh.position.z
            ]

        } else {

            data.position = [ 0, 0, 0 ]

        }

        mesh.updateMatrix()

        if ( data.size == null ) {

            data.size = { x: 132000, y: 132000, z: 132000 }

        }

        this.data = data
        this.mesh = mesh
        this.cleanUp = false
        // add to octree
        world.octree.add(mesh)
        three.scene.add(mesh)

    }

}
