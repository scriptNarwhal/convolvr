// @flow
/* bandwidth saving utility functions for multiplayer telemetry */
import { THREE } from 'three'

export let compressFloat = ( float: number, n: number ) => {

    return parseFloat( (float).toFixed(n) )

}

export let compressFloatArray = ( floats: Array<number>, n: number ) => {

    let x:   number        = 0,
        out: Array<number> = []

    while ( x < floats.length ) {

        out.push( parseFloat( floats[ x ].toFixed( n ) ) )
        x += 1

    }

    return out

}

export let compressVector3 = ( vec: THREE.Vector3, n: number ) => {

    return Object.assign({}, {
        x: parseFloat( vec.x.toFixed( n ) ),
        y: parseFloat( vec.y.toFixed( n ) ),
        z: parseFloat( vec.z.toFixed( n ) )
    })

}

export let compressVector4 = ( vec: THREE.Quaternion, n: number ) => {

    return Object.assign({}, {
        w: parseFloat( vec.w.toFixed( n ) ),
        x: parseFloat( vec.x.toFixed( n ) ),
        y: parseFloat( vec.y.toFixed( n ) ),
        z: parseFloat( vec.z.toFixed( n ) )
    })

}


