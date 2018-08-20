let videoChat = {
        id: -1,
        name: "video-chat",
        components: [
            {
                attrs: {
                    geometry: {
                        shape: "box",
                        size: [ 3, 3, 0.25 ]
                    },
                        material: {
                        color: 0x808080,
                        name: "plastic"
                    },
                    webrtc: {

                    },
                    text: {
                        lines: [ 
                            "Click To Video Chat", 
                        ],
                        color: "#ff00ff",
                        background: "#000000"
                    }
                },
                quaternion: [ 0, 0, 0, 1 ],
                position: [ 0, 0, -0.25]
            },
            {
                attrs: {
                    geometry: {
                        shape: "box",
                        size: [ 3, 3, 0.25 ]
                    },
                        material: {
                        color: 0x808080,
                        name: "plastic"
                    },
                    text: {
                        lines: [ 
                            "Click To Video Chat", 
                        ],
                        color: "#ff00ff",
                        background: "#000000"
                    }
                },
                quaternion: [ 0, 0, 0, 1 ],
                position: [ 0, 0, 0.25 ]
            }
        ]
}

export default videoChat