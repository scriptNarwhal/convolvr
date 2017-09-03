let block = {
        id: 0,
        name: "block",
        components: [{
            props: {
                geometry: {
                merge: true,
                    shape: "box",
                    size: [42000, 42000, 1000]
                },
                material: {
                    color: 0x808080,
                    name: "hard-light"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [0, 0, 0],
            components: []
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
}

export default block