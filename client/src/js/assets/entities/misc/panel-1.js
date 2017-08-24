let panel1 = {
        id: 0,
        name: "panel1",
        components: [
            {
                props: {
                    geometry: {
                        merge: true,
                        shape: "box",
                        size: [ 28000, 28000, 1500 ]
                    },
                    material: {
                        color: 0x808080,
                        name: "plastic"
                    }
                },
                quaternion: [ 0, 0, 0, 1 ],
                position: [ -4625, 0, 0 ],
                components: []
            },
            {
                props: {
                    geometry: {
                        merge: true,
                        shape: "box",
                        size: [ 32000, 32000, 15000 ]
                    },
                    material: {
                        color: 0x808080,
                        name: "plastic"
                    }
                },
                quaternion: [ 0, 0, 0, 1 ],
                position: [ 4625, 0, 0 ],
                components: []
            },
            
        ],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

export default panel1