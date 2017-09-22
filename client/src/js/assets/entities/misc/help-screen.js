let helpScreen = {
    id: -3,
    name: "help-screen",
    components: [
        {
            props: {
                geometry: {
                    shape: "box",
                    size: [ 3, 3, 0.25 ]
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
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: []
        }
    ]
}

export default helpScreen