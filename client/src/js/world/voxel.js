import Entity from '../entity'

export default class Voxel {

    constructor ( data, cell, voxels ) { // this should be refactored to use the terrain system

        let visible = data.visible,
            voxelGeom = null,
            world = three.world,
            scene = three.scene,
            altitude = 0,
            gridSize = 264000 / 16,
            narrow = gridSize * 0.87,
            mesh = null,
            geom = null, //new THREE.CylinderGeometry(532000, 532000, 835664, 6, 1),
            mat = null,
            x = 8,
            e = null

        voxels[ cell.join(".") ] = this

        this.entities = []  
        this.meshes = []

        !!data.entities && data.entities.map( ( e, i ) => {
            
            let entity = new Entity( e.id, e.components, e.position, e.quaternion )

            if ( i < 2 ) {
            
                entity.init( scene )

                if ( i == 0 ) {

                    data.position = e.position

                }

                this.entities.push( entity ) // init later

            }
            
        })

        altitude = data.altitude || 0

        if ( !! cell ) {

            data.cell = cell
           
        } else {

            data.position = [ 0, 0, 0 ]

        }

        this.data = data
        this.cleanUp = false

        return this

    }

}
