let chatScreen = {
        id: -4,
        name: "chat-screen",
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
                    chat: {
                        userId: "all",
                        displayMessages: true
                    },
                    text: {
                        lines: [ 
                            "Welcome To Convolvr 0.4a",
                        ],
                        color: "#ffffff",
                        background: "#000000"
                    }
                },
                quaternion: [ 0, 0, 0, 1 ],
                position: [ 0, 0, 0 ]
            }
        ]
    }

export default chatScreen