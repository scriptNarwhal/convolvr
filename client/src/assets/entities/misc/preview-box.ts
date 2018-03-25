let previewBox = {
            id: 0,
            name: "preview-box",
            components: [
                {
                    attrs: {
                        geometry: {
                            shape: "node",
                            size: [1, 1, 1]
                        },
                        material: {
                            color: 0x808080,
                            name: "basic"
                        },
                        noRayCast: {}
                    },
                    quaternion: [ 0, 0, 0, 1 ],
                    position: [ 0, 0, 0],
                    components: []
                },
                {
                    attrs: {
                        geometry: {
                            shape: "box",
                            size: [0.05, 0.050, 0.050]
                        },
                        material: {
                            color: 0xffffff,
                            name: "wireframe"
                        }
                    },
                    quaternion: null,
                    position: [ 0.25, -0.5, 0 ],
                    components: []
                },
                {
                    attrs: {
                        geometry: {
                            shape: "box",
                            size: [0.05, 0.050, 0.050]
                        },
                        material: {
                            color: 0xffffff,
                            name: "wireframe"
                        }
                    },
                    quaternion: null,
                    position: [ -0.25, -0.5, 0 ],
                    components: []
                },
            ],
            position: [ 0, 0, 0 ],
            quaternion: [ 0, 0, 0, 1 ]
        }

export default previewBox