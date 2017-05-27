let toolMenu = ( assetSystem ) => {

    let toolColors = [ 
        0x0707ff, 0x07ff00, 0xff0707, 0xff8007, 0x07ffff, 
        // 0xffff07, 0xff0707, 0x003bff, 0x07ff07, 0x07ffff
    ],
    iconTextures = [
        '/data/images/textures/icons/components.png',
        '/data/images/textures/icons/entities.png',
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

        toolColors.map( ( color, i ) => {

            let iconCube = {
                    props: Object.assign({}, assetSystem.initIconProps( color, iconTextures[i] ), {
                        toolUI: {
                            toolIndex: i
                        },
                        hover: {},
                        activate: {}
                    }),
                    components: [],
                    position: [ 0, 0, 0 ],
                    quaternion: null
                },
            button = assetSystem._initButton( iconCube ),
            row = Math.floor( i / 5 ) * 12000

            toolMenuIcons.push( Object.assign({}, button, {
                position: [ -26000 + (i % 5) *12000, row, 0 ],
                quaternion: null
            }))

        })

        return {
            id: -2,
            components: [
                {
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
                                    distance: 120000
                                }
                            },
                            position: [ 0, -2000, 6000 ],
                            quaternion: null
                            
                        }
                    ],
                    position: [ 0, 0, 0 ],
                    quaternion: null
                },
                {
                    props: {
                        geometry: {
                            shape: "node",
                            size: [ 1, 1, 1 ]
                        },
                            material: {
                            color: 0x808080,
                            name: "plastic"
                        },
                        toolUI: {
                            menu: true
                        }
                    },
                    components: toolMenuIcons,
                    quaternion: null,
                    position: [ 0, 0, 8000 ]
                }
            ],
            position: [ 0, 0, 0 ],
            quaternion: null
        }

}

export default toolMenu