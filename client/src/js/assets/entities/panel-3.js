let panel3 = {
            id: 0,
            name: "panel3",
            components: [
                {
                    props: {
                        geometry: {
                        merge: true,
                            shape: "box",
                            size: [42000, 42000, 4000]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [-0, 10250, 0]
                },
                {
                    props: {
                        geometry: {
                        merge: true,
                            shape: "hexagon",
                            size: [18000, 28000, 1000]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [0, 4625, 0]
                },
                {
                    props: {
                        geometry: {
                        merge: true,
                            shape: "box",
                            size: [10000, 22000, 1000]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [-0, -10250, 0]
                },
                {
                    props: {
                        geometry: {
                        merge: true,
                            shape: "hexagon",
                            size: [28000, 18000, 1000]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [0, -4625, 0]
                },
            ],
            position: [ 0, 0, 0 ],
            quaternion: null
        }

export default panel3