let wirebox = {
    id: 0,
    name: "wirebox",
    components: [
        {
            props: {
                geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [0.080, 0.080, 1000]
                },
                material: {
                    color: 0x808080,
                    name: "plastic"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [0, 0, 0]
        },
        {
            props: {
                geometry: {
                    merge: true,
                    shape: "torus",
                    size: [0.080, 0.080, 1000]
                },
                material: {
                    color: 0x808080,
                    name: "plastic"
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