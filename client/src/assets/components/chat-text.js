
let chatText = (config) => {
    return {
        position: [0, 4, 0],
        quaternion: [0,0,0,1],
        props: {
            geometry: {
                size: [4, 0.8, 1.2],
                shape: "box"
            },
            text: {
                label: true,
                lines: ["..."]
            },
            chat: {
                displayMessages: true,
                userId: config.userId
            }
        }
    }
  }

export default chatText