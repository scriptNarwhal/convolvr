let toolMenu = (assetSystem) => {

    let toolColors = [
        0x07ff00, 0x0707ff, 0xff0707, 0xff8007, 0x07ffff,
        // 0xffff07, 0xff0707, 0x003bff, 0x07ff07, 0x07ffff
    ],
        iconTextures = [
            '/data/images/textures/icons/entities.png',
            '/data/images/textures/icons/components.png',
            '/data/images/textures/icons/systems.png',
            '/data/images/textures/icons/geometries.png',
            '/data/images/textures/icons/materials.png',
            // '/data/images/textures/icons/worlds.png',
            // '/data/images/textures/icons/places.png',
            // '/data/images/textures/icons/assets.png',
            // '/data/images/textures/icons/files.png',
            // '/data/images/textures/icons/directories.png',
        ],
        toolMenuIcons = [],
        toolMenu = null

    toolColors.map(( color, i ) => {

        let iconCube = {
            props: Object.assign({}, assetSystem.initIconProps(color, iconTextures[i]), {
                toolUI: {
                    toolIndex: i
                },
                hover: {},
                activate: {},
                lookAway: {}
            }),
            components: [],
            position: [ 0, 0, 0 ],
            quaternion: null
        },
            button = assetSystem._initButton(iconCube),
            row = Math.floor( i / 5 ) * 12000

        toolMenuIcons.push(Object.assign({}, button, {
            position: [ -22500 + (i % 5) * 12000, row, 10000 ],
            quaternion: null
        }))

    })

    let currentIndicator = {
        props: {
            geometry: {
                shape: "box",
                size: [ 10000, 10000, 4000 ]
            },
            material: {
                color: 0xffffff,
                name: "plastic"
            },
            toolUI: {
                currentTool: true
            }
        },
        components: [
            {
                props: {
                    geometry: {
                        shape: "node",
                        size: [ 1, 1, 1 ]
                    },
                    light: {
                        type: "point",
                        intensity: 0.9,
                        color: 0xffffff,
                        distance: 12000
                    }
                },
                position: [ 0, -2000, -8000 ],
                quaternion: null

            }
        ],
        position: [ 0, 0, 0 ],
        quaternion: null
    }

    return {
        id: -2,
        components: [
            currentIndicator,
            ...toolMenuIcons
            // {
            //     props: {
            //         geometry: {
            //             shape: "box",
            //             size: [ 64000, 12000, 4000 ]
            //         },
            //         material: {
            //             color: 0x808080,
            //             name: "plastic"
            //         },
            //         toolUI: {
            //             menu: true
            //         },
            //         captureEvents: true // pass them to child components
            //     },
            //     components: [currentIndicator, ...toolMenuIcons],
            //     quaternion: null,
            //     position: [ 0, 0, 8000 ]
            // }
        ],
        position: [ 0, 0, 0 ],
        quaternion: null
    }

}

export default toolMenu