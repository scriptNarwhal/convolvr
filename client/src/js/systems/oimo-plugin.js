//@flow
import Convolvr from '../world/world'
import Component from '../component'
import { THREE } from 'three'

export default class OimoPluginSystem {

    world: Convolvr
    worker: Object
    meshes: Array<THREE.Mesh>
    oimoInfo: Object

    constructor ( world: Convolvr ) {
        
        let worker: Object = new Worker("/data/js/workers/oimo.js"),
            meshes: Array<THREE.Mesh> = this.meshes = [],
            dt: number = 1/60;
        
        const ToRad = Math.PI / 180,
              N = 666

        this.worker = worker
        this.world = world
        worker.postMessage = worker.webkitPostMessage || worker.postMessage

        worker.onmessage = e => {

            // stat
            this.oimoInfo = e.data.perf;
            // Get fresh data from the worker
            let minfo: Object = e.data.minfo,
                body: Array<THREE.Mesh> = this.meshes;

            if ( typeof minfo != 'object' ) return

            var length = meshes.length,
                b: Object = {},
                id = 0,
                n = 0
               
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
     * @param {Component} component 
    */
    init ( component: Component ) { 
        
        let prop = component.props.omio

        //TODO: implement

        return {


        }

    }

}

