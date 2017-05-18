let wirebox = {
    id: 0,
    components: [
        {
            props: {
                geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [16000, 16000, 1000]
                },
                material: {
                    color: 0x808080,
                    name: "plastic"
                }
            },
            quaternion: null,
            position: [0, 0, 0]
        },
        {
            props: {
                geometry: {
                merge: true,
                shape: "torus",
                size: [16000, 16000, 1000]
                },
                material: {
                color: 0x808080,
                name: "plastic"
                }
            },
            quaternion: null,
            position: [0, 0, 0]
        }
    ],
    position: [ 0, 0, 0 ],
    quaternion: null
}

export default wirebox