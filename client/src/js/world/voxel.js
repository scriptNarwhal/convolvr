//@flow

import Entity from '../entity'
import Convolvr from './world'
import { THREE } from 'three'

export default class Voxel {

    data:     Object
    world:    Convolvr
    entities: Array<Entity>
    meshes:   Array<THREE.Mesh>
    coords:   Array<number>
    cleanUp:  boolean

    constructor ( data: Object, cell: Array<number>, world: Convolvr ) {

        let visible:  boolean     = data.visible,
            scene:    THREE.Scene = world.three.scene,
            altitude: number      = 0

        this.coords = cell
        this.entities = []  
        this.meshes = []
        this.world = world
        
        altitude = data.altitude || 0

        if ( !! cell ) {

            data.cell = cell
            
        } else {

            data.position = [ 0, 0, 0 ]

        }

        this.data = data
        this.cleanUp = false

    }

    preLoadEntities () {

        let scene:  Object        = this.world.three.scene,
            coords: Array<number> = this.coords

        !!this.data.entities && this.data.entities.map( ( e, i ) => {
            
            let entity: Entity = new Entity( e.id, e.components, e.position, e.quaternion, coords )

            if ( i < 2 ) {
            
                entity.init( scene )

                if ( i == 0 )

                    this.data.position = e.position


            }

            this.entities.push( entity ) // init later
            
        })

    }
    

}
