//@flow
import Convolvr from '../../../world/world'
import Component from '../../../core/component'
import Entity from '../../../core/entity'
import Voxel from '../../../core/voxel'
import { THREE } from 'three'

export default class OimoPluginSystem {

    world: Convolvr
    worker: Object
    meshes: Array<THREE.Mesh>
    oimoInfo: Object

    constructor ( world: Convolvr ) {
        
        let worker: Object            = new Worker("/data/js/workers/oimo.js"),
            meshes: Array<THREE.Mesh> = this.meshes = [],
            dt:     number            = 1 / 60;
        
        const ToRad: number = Math.PI / 180,
              N:     number = 666

        this.worker = worker
        this.world = world
        worker.postMessage = worker.webkitPostMessage || worker.postMessage

        worker.onmessage = e => {
            // stat
            this.oimoInfo = e.data.perf;
            // Get fresh data from the worker
            let minfo: Object = e.data.minfo,
                body:  Array<THREE.Mesh> = this.meshes;

            if ( typeof minfo != 'object' ) return

            var length: number = meshes.length,
                b:      Object = {},
                id:     number = 0,
                n:      number = 0
               
            while ( id < length ) {

                n = id * 8
                b = body[ id ]

                if ( b !== null && minfo[ n+7 ] !==1 ) {
                    
                    b.position.fromArray( minfo, n );
                    b.quaternion.fromArray( minfo, n+3 );
                
                }

                id += 1

            }

        }

        worker.postMessage({  N:N, dt:dt, oimoUrl: "/data/lib/oimo/oimo.min.js" } )

    }

    /**
     * Registers component with this system
    */
    init ( component: Component ) { 
        
        let prop: Object = component.props.oimo

        //TODO: implement

        return {


        }

    }

    addVoxels ( voxels: Array<Object> ) {

        this.worker.postMessage( { action: "add voxels", voxels } )  

    }

    addEntity ( entity: Object ) {

        this.worker.postMessage( { action: "add entity", entity: { id: entity.id, position: entity.position, quaternion: entity.quaternion, components: entity.components }} )

    }

    setInMotion ( entity: Entity ) {

        let hasPhysics = entity.componentsByProp.oimo

        if ( false == hasPhysics ) {

            this.addEntity( entity )

        } 




    }

    makeStatic ( entity: Entity ) {
        
        let hasPhysics = entity.componentsByProp.oimo

        this.worker.postMessage( { action: "make static", entityId: entity.id, voxel: entity.voxel } ) 

    }


}

