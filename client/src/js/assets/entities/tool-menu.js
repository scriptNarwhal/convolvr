let toolMenu = ( assetSystem ) => {

    let toolColors = [ 0xff0707, 0x003bff, 0x07ff07, 0x07ffff, 0xa007ff, 0xffff07 ],
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
                    position: [0, 0, 0],
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
                            size: [ 24000, 6000, 2000 ]
                        },
                        material: {
                            color: 0x808080,
                            name: "plastic"
                        },
                        text: {
                            color: "#ffffff",
                            background: "#000000",
                            lines: [ "Entity Tool" ]
                        },
                        toolUI: {
                            currentToolLabel: true
                        },
                        light: {
                            type: "point",
                            intensity: 0.9,
                            color: 0xffffff,
                            distance: 120000
                        }
                    },
                    // components: [],
                    position: [ -13000, -24000, 0 ],
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
                    position: [ 0, 0, 0 ]
                }
            ],
            position: [ 0, 0, 0 ],
            quaternion: null
        }

}

export default toolMenu