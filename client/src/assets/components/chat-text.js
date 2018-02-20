
let chatText = (config) => {
    return {
        position: [0, 4, 0],
        quaternion: [0,0,0,1],
        props: {
            geometry: {
                size: [4, 0.8, 1.2],
                shape: "box"
            },
            material: {
                color: 0x808080,
                 name: "plastic"
            },
            text: {
                label: true,
                lines: ["..."],
                color: "#00ff00",
                background: "#000000"
            },
            chat: {
                displayMessages: true,
                userId: config.userId
            }
        }
    }
  }

export default chatText