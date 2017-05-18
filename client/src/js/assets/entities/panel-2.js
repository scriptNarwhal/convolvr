let panel2 = {
            id: 0,
            components: [
                {
                    props: {
                        geometry: {
                            merge: true,
                            shape: "hexagon",
                            size: [28000, 28000, 1500]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [-4625, 0, 0]
                },
                {
                    props: {
                        geometry: {
                            merge: true,
                            shape: "torus",
                            size: [28000, 28000, 15000]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [4625, 0, 0]
                },
                {
                    props: {
                        geometry: {
                            merge: true,
                            shape: "hexagon",
                            size: [28000, 28000, 1500]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [-10250, 0, 0]
                },
                {
                    props: {
                        geometry: {
                            merge: true,
                            shape: "cylinder",
                            size: [12000, 18000, 1500]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: null,
                    position: [10250, 0, 0]
                },
            ],
            position: [ 0, 0, 0 ],
            quaternion: null
        }

export default panel2