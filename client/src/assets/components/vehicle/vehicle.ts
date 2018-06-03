let vehicle = {
    attrs: {
        geometry: {
            merge: true,
            shape: "box",
            size: [ 1.333, 0.333, 2.5 ]
        },
        material: {
            color: 0xa0a0a0,
            name: "plastic"
        },
        vehicle: {

        }
    },
    quaternion: [ 0, 0, 0, 1 ],
    position: [ 0, 0, 0 ],
    components: [
        {
            attrs: {
                geometry: {
                    merge: true,
                    shape: "box",
                    size: [ 1.333, 0.333, 2.5 ]
                },
                material: {
                    color: 0xa0a0a0,
                    name: "plastic"
                },
                control: {

                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
        }
    ]
}

export default vehicle;