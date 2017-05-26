let column1 = {
            id: 0,
            components: [
                {
                props: {
                    geometry: {
                    merge: true,
                        shape: "box",
                        size: [ 10000, 22000, 1000 ]
                    },
                    material: {
                        color: 0x808080,
                        name: "plastic"
                    }
                },
                quaternion: null,
                position: [ 0, 0, 0 ]
                },{
                props: {
                    geometry: {
                        merge: true,
                        shape: "hexagon",
                        size: [ 16000, 18000, 1000 ]
                    },
                    material: {
                        color: 0x808080,
                        name: "plastic"
                    }
                },
                quaternion: null,
                position: [ 0, -16000, 0 ]
                },{
                props: {
                    geometry: {
                        merge: true,
                        shape: "hexagon",
                        size: [ 18000, 18000, 1000 ]
                    },
                    material: {
                        color: 0x808080,
                        name: "plastic"
                    }
                },
                quaternion: null,
                position: [ 0, 16000, 0 ]
                }
            ],
            position: [ 0, 0, 0 ],
            quaternion: null
        }

export default column1