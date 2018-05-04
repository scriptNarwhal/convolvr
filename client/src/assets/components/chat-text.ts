
let chatText = (config: any) => {
    console.log(config.userName);
    return {
        position: [0, 2.5, 0],
        quaternion: [0,0,0,1],
        attrs: {
            geometry: {
                size: [4, 2, 1],
                shape: "box"
            },
            material: {
                color: 0x808080,
                 name: "plastic"
            },
            text: {
                canvasSize: [9, 8],
                label: true,
                lines: ["..."],
                color: "#ffff00",
                background: "#00000000"
            },
            chat: {
                displayMessages: true,
                userName: config.userName
            }
        }
    }
  }

export default chatText