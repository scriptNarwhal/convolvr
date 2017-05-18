let helpScreen = {
    id: -3,
    components: [
        {
            props: {
                geometry: {
                    shape: "box",
                    size: [70000, 16000, 1000]
                },
                    material: {
                    color: 0x808080,
                    name: "plastic"
                },
                text: {
                    lines: [],
                    color: "#ffffff",
                    background: "#000000"
                }
            },
            quaternion: null,
            position: [ 0, 0, 0 ]
        }
    ]
}

export default helpScreen