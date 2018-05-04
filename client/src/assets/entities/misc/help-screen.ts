import { DBComponent } from "../../../core/component";

let helpScreen = {
    id: -3,
    name: "help-screen",
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
                text: {
                    lines: [
                        "#💻 Desktop users",
                        "- ⌨️ WASD, RF, space keys: movement",
                        "- Mouselook (click screen)",
                        "- Left click: use tool Right click: grab",
                        "- Keys 0-9: switch tool",
                        "- 🎮 Left Trigger: Grab, Right: Use Tool",
                        "",
                        "#👓 Desktop VR users ",
                        "- Enter VR button in bottom right corner",
                        "- 🔦 If you have tracked controllers:",
                        " * Right / Left trigger: use tool in hand",
                        " * Right stick x/y axis: change tool(mode)",
                        " * Left stick: movement",
                        "",
                        "#📱 Mobile users (2d or with VR viewer)",
                        "- Device orientation controls the camera",
                        "- Swiping, dragging & gamepads move you"
                    ],
                    color: "#00ff00",
                    background: "#000000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: [] as DBComponent[]
        }
    ]
}

export default helpScreen