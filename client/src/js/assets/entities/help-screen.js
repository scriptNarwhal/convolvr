let helpScreen = {
    id: -3,
    components: [
        {
            props: {
                geometry: {
                    shape: "box",
                    size: [70000, 70000, 1000]
                },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                },
                text: {
                    lines: [],
                    color: "#00ff00",
                    background: "#000000"
                }
            },
            quaternion: null,
            position: [ 0, 0, 0 ]
        }
    ]
}

export default helpScreen