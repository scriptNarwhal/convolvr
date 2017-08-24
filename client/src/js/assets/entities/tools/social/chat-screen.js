let chatScreen = {
        id: -4,
        name: "chat-screen",
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
                    chat: {
                        userId: "all",
                        displayMessages: true
                    },
                    text: {
                        lines: [ 
                            "Welcome To Convolvr", 
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