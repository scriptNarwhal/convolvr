import  { DBComponent } from "../../../../../core/component";

let entity = {
    id: -1,
    name: "statement-pallet",
    components: [{
        attrs: {
            geometry: {
                shape: "box",
                size: [ 1, 0.1, 1 ]
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
    quaternion: [ 0, 0, 0, 1 ]
}

export default entity;