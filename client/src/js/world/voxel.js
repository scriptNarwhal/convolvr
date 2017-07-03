import Entity from '../entity'

export default class Voxel {

    constructor ( data, cell, voxels ) { // this should be refactored to use the terrain system

        let visible = data.visible,
            voxelGeom = null,
            world = three.world,
            scene = three.scene,
            altitude = 0

        this.data = data
        this.entities = []  
        this.meshes = []
        voxels[ cell.join(".") ] = this
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

    preLoadEntities () {

        !!this.data.entities && this.data.entities.map( ( e, i ) => {
            
            let entity = new Entity( e.id, e.components, e.position, e.quaternion )

            if ( i < 2 ) {
            
                entity.init( three.scene )

                if ( i == 0 )

                    this.data.position = e.position

                this.entities.push( entity ) // init later

            }
            
        })

    }

}
