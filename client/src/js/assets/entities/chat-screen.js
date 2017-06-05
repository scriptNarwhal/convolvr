let chatScreen = {
        id: -4,
        components: [
            {
                props: {
                    geometry: {
                        shape: "box",
                        size: [ 72000, 72000, 1000 ]
                    },
                        material: {
                        color: 0x808080,
                        name: "plastic"
                    },
                    text: {
                        lines: [ 
                            "Welcome To Convolvr", 
                        ],
                        color: "#ffffff",
                        background: "#000000"
                    }
                },
                quaternion: null,
                position: [ 0, 0, 0 ]
            }
        ]
    }

export default chatScreen