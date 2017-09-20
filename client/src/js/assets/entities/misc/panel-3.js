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
                    position: [-0, 10250, 0],
                    components: []
                },
                {
                    props: {
                        geometry: {
                        merge: true,
                            shape: "hexagon",
                            size: [0.8, 1.1, 1000]
                        },
                        material: {
                            color: 0x808080,
                            name: "hard-light"
                        }
                    },
                    quaternion: null,
                    position: [0, 4625, 0],
                    components: []
                },
                {
                    props: {
                        geometry: {
                        merge: true,
                            shape: "box",
                            size: [0.5,, 1, 1000]
                        },
                        material: {
                            color: 0x808080,
                            name: "hard-light"
                        }
                    },
                    quaternion: null,
                    position: [-0, -10250, 0],
                    components: []
                },
                {
                    props: {
                        geometry: {
                        merge: true,
                            shape: "hexagon",
                            size: [1.1, 0.8, 1000]
                        },
                        material: {
                            color: 0x808080,
                            name: "hard-light"
                        }
                    },
                    quaternion: null,
                    position: [0, -4625, 0],
                    components: []
                },
            ],
            position: [ 0, 0, 0 ],
            quaternion: [ 0, 0, 0, 1 ]
        }

export default panel3