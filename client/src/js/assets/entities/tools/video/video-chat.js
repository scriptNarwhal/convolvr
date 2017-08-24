let videoChat = {
        id: -1,
        name: "video-chat",
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
                position: [ 0, 0, -5000]
            },
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
                            "Click To Video Chat", 
                        ],
                        color: "#ff00ff",
                        background: "#000000"
                    }
                },
                quaternion: [ 0, 0, 0, 1 ],
                position: [ 0, 0, 5000 ]
            }
        ]
}

export default videoChat