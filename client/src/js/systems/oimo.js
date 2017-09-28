//@flow
import { OIMO } from 'oimo'

let world:  Object        = {},
    minfo:  Object        = {},
    fps:    number        = 0,
    f:      Array<number> = [ 0, 0, 0 ],
    body:   Array<Object> = [],
    byCell: Object        = {}

self.onmessage = ( e: Object ) => {

    if ( e.data.action ) {

        switch ( e.data.action ) {

            case "add voxels":
                addVoxels( e.data.voxels )
            break
            case "add entity":
                addEntity( e.data.entity )
            break
            case "make static":
                makeStatic( e.data.entityId, e.data.voxel )
            break

        }

    }

    if ( e.data.oimoUrl && !world ) {
        
        // Load oimo.js
        importScripts( e.data.oimoUrl )
        // Init physics
        world = new OIMO.World( { timestep:e.data.dt, iterations:8, broadphase:2, worldscale:1, random:true, info:false } )
        // Ground plane // make configurable
        
        let ground = world.add({size:[200, 20, 200], pos:[0,-10,0]}),
            N = e.data.N

            minfo = new Float32Array( N * 8 )
            setInterval( update, e.data.dt*1000 )

    }

}

let update = () => {

    // Step the world
    world.step()

    let length = body.length,
        id = 0,
        n = 0,
        i = 0,
        b = null
            
    while ( id < body.length ) {

            b = body[ id ]
            n = 8 * id

            if ( b.sleeeping ) {

                minfo[ n + 7 ] = 1;

            } else {

                minfo[ n + 7 ] = 0;
                b.getPosition().toArray( minfo, n );
                b.getQuaternion().toArray( minfo, n+3 );

            }

            id += 1

        }

        f[1] = Date.now();
        if ( f[1]-1000>f[0]){ f[0]=f[1]; fps=f[2]; f[2]=0; } f[2]++;

        self.postMessage({ perf:fps, minfo:minfo })

    },
    addEntity = ( entity: Object ) => {

        let newBody:    Object  = {},
            isInMotion: boolean = false

        entity.components.map( comp => {

            if ( comp.props.oimo && comp.props.oimo.velocity ) {
                // set velocity
            }

        })

        //body[i] = world.add({type:'sphere', size:[0.25], pos:[x,(0.5*i)+0.5,z], move:true})
        //body[i] = world.add({type:'box', size:[0.5,0.5,0.5], pos:[x,((0.5*i)+0.5),z], move:true})


    },
    addVoxels = ( voxels: Array<Object> ) => {

        if ( voxels != null ) {

            voxels.map( v => {

                if ( v.entities ) {

                    v.entities.map( ent => {

                        addEntity( ent )

                    })

                }

            })

        }

    },
    makeStatic = ( entityId: number, voxel: Array<number> ) => {

        // implement

    }

