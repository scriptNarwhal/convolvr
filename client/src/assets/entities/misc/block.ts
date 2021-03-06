import { DBComponent } from "../../../model/component";

let block = {
        id: -1,
        name: "block",
        components: [{
            attrs: {
                geometry: {
                merge: true,
                    shape: "box",
                    size: [2, 2, 0.05]
                },
                material: {
                    color: 0x808080,
                    name: "hard-light"
                },
                floor: {
                    level: 0
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [0, 0, 0],
            components: [] as DBComponent[]
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
}

export default block