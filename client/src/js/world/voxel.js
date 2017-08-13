//@flow

import Entity from '../entity'
import { THREE } from 'three'

export default class Voxel {

    data: Object
    entities: Array<Entity>
    meshes: Array<THREE.Mesh>
    coords: Array<number>

    constructor ( data: Object, cell: Array<number> ) {

        let visible = data.visible,
            voxelGeom = null,
            world = three.world,
            scene = three.scene,
            altitude = 0

        this.data = data
        this.entities = []  
        this.meshes = []
        
        altitude = data.altitude || 0

        if ( !! cell ) {

            data.cell = cell
            
        } else {

            data.position = [ 0, 0, 0 ]

        }

        this.cell = cell
        this.data = data
        this.cleanUp = false

    }

    preLoadEntities () {
        
        !!this.data.entities && this.data.entities.map( ( e, i ) => {
            
            let entity = new Entity( e.id, this.cell, e.components, e.position, e.quaternion )

            if ( i < 2 ) {
            
                entity.init( three.scene )

                if ( i == 0 )

                    this.data.position = e.position


            }

            this.entities.push( entity ) // init later
            
        })

    }
    

}
