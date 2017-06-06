let block = {
        id: 0,
        name: "block",
        components: [
            {
            props: {
                geometry: {
                merge: true,
                    shape: "box",
                    size: [42000, 42000, 1000]
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

export default block