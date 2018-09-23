import { DBEntity } from "../../../../core/entity";

let terminal = {
    id: -1,
    name: "terminal",
    components: [
        { 
            class: "terminal-case",
            position: [0,0,0],
            attrs: {
                script: {
                    repl: true
                }
            },
            components: [
                { class: "cpu",
                    position: [0,0,-1]
                },
                { class: "io-controller",
                    position: [-1,0,0]
                },
                { class: "display-adapter",
                    position: [1,0,-1]
                },
                { class: "network-interface",
                    position: [-1,0,-1]
                },
                { class: "disk-drive",
                    position: [-1,0,1]
                }
            ]
        },
        { class: "screen",
            position: [0,1,0]
        },
        { class: "keyboard",
            position: [0,-1,0]
        },
    ],
    position: [ 0, 0, 0 ],
    quaternion: [ 0, 0, 0, 1 ]
} as DBEntity;

export default terminal;