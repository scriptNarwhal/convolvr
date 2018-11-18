import { DBComponent } from "../../../model/component";

let panel3 = {
            id: 0,
            name: "panel3",
            components: [
                {
                    attrs: {
                        geometry: {
                        merge: true,
                            shape: "box",
                            size: [2, 2, 0.2]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        }
                    },
                    quaternion: [0, 0, 0, 1],
                    position: [-0, 0.5, 0],
                    components: [] as DBComponent[]
                },
                {
                    attrs: {
                        geometry: {
                        merge: true,
                            shape: "hexagon",
                            size: [0.8, 1.1, 0.05]
                        },
                        material: {
                            color: 0x808080,
                            name: "hard-light"
                        }
                    },
                    quaternion: [0, 0, 0, 1],
                    position: [0, 4625, 0],
                    components: []
                },
                {
                    attrs: {
                        geometry: {
                        merge: true,
                            shape: "box",
                            size: [0.5, 1, 0.05]
                        },
                        material: {
                            color: 0x808080,
                            name: "hard-light"
                        }
                    },
                    quaternion: [0, 0, 0, 1],
                    position: [-0, -10250, 0],
                    components: []
                },
                {
                    attrs: {
                        geometry: {
                        merge: true,
                            shape: "hexagon",
                            size: [1.1, 0.8, 0.05]
                        },
                        material: {
                            color: 0x808080,
                            name: "hard-light"
                        }
                    },
                    quaternion: [0, 0, 0, 1],
                    position: [0, -0.14, 0],
                    components: []
                },
            ],
            position: [ 0, 0, 0 ],
            quaternion: [ 0, 0, 0, 1 ]
        }

export default panel3