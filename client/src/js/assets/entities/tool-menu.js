let toolMenu = ( assetSystem ) => {

    let toolColors = [ 
        0xff0707, 0x003bff, 0x07ff07, 0x07ffff, 0xa007ff, 0xffff07,
        0x880303, 0x001588, 0x07ff07, 0x038888, 0xa00388, 0x888803
    ],
    toolMenuIcons = [],
    toolMenu = null

        toolColors.map( ( color, i ) => {

            let iconCube = {
                    props: Object.assign({}, assetSystem._initIconProps( color ), {
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
            button = assetSystem._initButton( iconCube )

            toolMenuIcons.push( Object.assign({}, button, {
                position: [ -26000 + i *13000, 0, 0 ],
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