let block = {
    id: -1,
    name: "file-browser",
    components: [{
        props: {
            geometry: {
                shape: "box",
                size: [ 42000, 42000, 42000 ]
            },
            material: {
                color: 0xffffff,
                name: "metal"
            },
            file: {
                listFiles: {
                    username: "public",
                    dir: ""
                },
                listDirectories: {
                    username: "public",
                    dir: ""
                }
            }
        },
        quaternion: [ 0, 0, 0, 1 ],
        position: [ 0, 0, 0 ],
        components: []
    }],
    position: [ 0, 0, 0 ],
    quaternion: [ 0, 0, 0, 1 ]
}

export default block