import Component from "../../../../core/component";
import { DBEntity } from "../../../../core/entity";

let block = {
    id: -1,
    name: "file-browser",
    components: [{
        attrs: {
            geometry: {
                shape: "box",
                size: [ 2, 2, 2 ]
            },
            material: {
                color: 0xffffff,
                name: "metal"
            },
            file: {
                listFiles: {
                    username: "public",
                    dir: ""
                },
                listDirectories: {
                    username: "public",
                    dir: ""
                }
            },
            metaFactory: {
                type: "file",
                dataSource: "self", // implement self source
                attrName: ""
            },
            layout: {
                type: "grid",
                mode: "factory",
                columns: 6,
                plane: "xz"
            }
        },
        quaternion: [ 0, 0, 0, 1 ],
        position: [ 0, 0, 0 ],
        components: ([] as Component[]),
    }],
    position: [ 0, 0, 0 ],
    quaternion: [ 0, 0, 0, 1 ],
    tags:["information-hardware"]
} as DBEntity

export default block