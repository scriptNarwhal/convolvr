let gun = {
    attrs: {
        geometry: {
            merge: true,
            shape: "hexagon",
            size: [ 0.333, 0.333, 0.5 ]
        },
        material: {
            color: 0xa0a0a0,
            name: "plastic"
        },
        factory: {
            // redundant?
        },
        weapon: {

        }
    },
    quaternion: [ 0, 0, 0, 1 ],
    position: [ 0, 0, 0 ]
}

export default gun