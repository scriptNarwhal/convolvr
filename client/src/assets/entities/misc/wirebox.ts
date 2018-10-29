let wirebox = {
    id: 0,
    name: "wirebox",
    components: [
        {
            attrs: {
                geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [0.080, 0.080, 0.5]
                },
                material: {
                    color: 0x808080,
                    name: "plastic"
                },
                floor: {
                    level: 0
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [0, 0, 0]
        },
        {
            attrs: {
                geometry: {
                    merge: true,
                    shape: "torus",
                    size: [0.080, 0.080, 0.5]
                },
                material: {
                    color: 0x808080,
                    name: "plastic"
                },
                floor: {
                    level: 0
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [0, 0, 0]
        }
    ],
    position: [ 0, 0, 0 ],
    quaternion: [ 0, 0, 0, 1 ]
}

export default wirebox