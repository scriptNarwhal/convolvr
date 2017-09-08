let previewBox = {
            id: 0,
            name: "preview-box",
            components: [
                // {
                //     props: {
                //         geometry: {
                //             merge: true,
                //             shape: "torus",
                //             size: [28000, 28000, 15000]
                //         },
                //         material: {
                //             color: 0x808080,
                //             name: "plastic"
                //         }
                //     },
                //     quaternion: [ 0, 0, 0, 1 ],
                //     position: [ 0, 0, 0],
                //     components: []
                // },
                // {
                //     props: {
                //         geometry: {
                //             merge: true,
                //             shape: "hexagon",
                //             size: [28000, 28000, 1500]
                //         },
                //         material: {
                //             color: 0x808080,
                //             name: "plastic"
                //         }
                //     },
                //     quaternion: [ 0, 0, 0, 1 ],
                //     position: [0, 0, 0],
                //     components: []
                // },
                // {
                //     props: {
                //         geometry: {
                //             merge: true,
                //             shape: "hexagon",
                //             size: [28000, 28000, 1500]
                //         },
                //         material: {
                //             color: 0xffffff,
                //             name: "metal"
                //         }
                //     },
                //     quaternion: [ 0, 0, 0, 1 ],
                //     position: [0, 20000, 0],
                //     components: []
                // },
                {
                    props: {
                        geometry: {
                            shape: "box",
                            size: [12000, 12000, 12000]
                        },
                        material: {
                            color: 0xffffff,
                            name: "wireframe"
                        }
                    },
                    quaternion: null,
                    position: [0, -10250, 0],
                    components: []
                },
            ],
            position: [ 0, 0, 0 ],
            quaternion: [ 0, 0, 0, 1 ]
        }

export default previewBox