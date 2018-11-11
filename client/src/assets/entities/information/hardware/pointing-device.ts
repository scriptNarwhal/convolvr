import  { DBComponent } from "../../../../model/component";
import { DBEntity } from "../../../../model/entity";

let pointingDevice = {
    id: -1,
    name: "pointing-device",
    components: [{
        attrs: {
            geometry: {
                shape: "box",
                size: [ 2, 2, 2 ]
            },
            material: {
                color: 0xffffff,
                name: "metal"
            }
        },
        quaternion: [ 0, 0, 0, 1 ],
        position: [ 0, 0, 0 ],
        components: ([] as DBComponent[]),
    }],
    position: [ 0, 0, 0 ],
    quaternion: [ 0, 0, 0, 1 ],
    tags:["information-hardware"]
} as DBEntity

export default pointingDevice;