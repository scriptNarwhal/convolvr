let column1 = {
    id: -1,
    name: "column1",
    components: [
        {
            attrs: {
                geometry: {
                merge: true,
                    shape: "box",
                    size: [ 0.5, 1, 0.5 ]
                },
                material: {
                    color: 0x808080,
                    name: "plastic"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ]
        },
        {
            attrs: {
                geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [ 0.080, 0.8, 1 ]
                },
                material: {
                    color: 0x808080,
                    name: "hard-light"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, -0.080, 0 ]
        },
        {
            attrs: {
                geometry: {
                    merge: true,
                    shape: "hexagon",
                    size: [ 0.8, 0.8, 1 ]
                },
                material: {
                    color: 0x808080,
                    name: "plastic"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0.080, 0 ]
        }
    ],
    position: [ 0, 0, 0 ],
    quaternion: [ 0, 0, 0, 1 ]
}

export default column1