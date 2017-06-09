/* bandwidth saving utility functions for multiplayer telemetry */

export let compressFloat = ( float, n ) => {

    return parseFloat( (float).toFixed(n) )

}

export let compressFloatArray = ( floats, n ) => {

    let x = floats.length -1,
        out = []

    while ( x >= 0 ) {

        out.push( parseFloat( floats[ x ].toFixed( n ) ) )
        x --

    }

    return out

}

export let compressVector3 = ( vec, n ) => {

    return Object.assign({}, {
        x: parseFloat( vec.x.toFixed( n ) ),
        y: parseFloat( vec.y.toFixed( n ) ),
        z: parseFloat( vec.z.toFixed( n ) )
    })

}

export let compressVector4 = ( vec, n ) => {

    return Object.assign({}, {
        w: parseFloat( vec.w.toFixed( n ) ),
        x: parseFloat( vec.x.toFixed( n ) ),
        y: parseFloat( vec.y.toFixed( n ) ),
        z: parseFloat( vec.z.toFixed( n ) )
    })

}


