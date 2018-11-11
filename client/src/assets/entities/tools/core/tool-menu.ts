import AssetSystem from "../../../../systems/core/assets";
import { DBComponent } from "../../../../model/component";

let toolMenu = (assetSystem: AssetSystem, config: any, voxel: number[]) => {

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
            // '/data/images/textures/icons/spaces.png',
            // '/data/images/textures/icons/places.png',
            // '/data/images/textures/icons/assets.png',
            // '/data/images/textures/icons/files.png',
            // '/data/images/textures/icons/directories.png',
        ],
        toolMenuIcons: DBComponent[] = [],
        toolMenu = null

    toolColors.map(( color, i ) => {

        let iconCube = {
            attrs: Object.assign({}, assetSystem.initIconProps(color, iconTextures[i]), {
                toolUI: {
                    toolIndex: i
                },
                hover: {},
                activate: {},
                lookAway: {}
            }),
            components: [] as DBComponent[],
            position: [ 0, 0, 0 ],
            quaternion: [ 0, 0, 0, 1 ]
        },
            button = assetSystem["_initButton"](iconCube),
            row = Math.floor( i / 5 ) * 0.050

        toolMenuIcons.push(Object.assign({}, button, {
            position: [ -1 + (i % 5) * 0.5, row - 0.05, 0.25 ],
            quaternion: [ 0, 0, 0, 1 ]
        }))

    })

    let currentIndicator = {
        attrs: {
            geometry: {
                shape: "box",
                size: [ 0.75, 0.25, 0.75 ]
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
                attrs: {
                    geometry: {
                        shape: "node",
                        size: [ 1, 1, 1 ]
                    },
                    light: {
                        type: "point",
                        intensity: 0.9,
                        color: 0xffffff,
                        distance: 320
                    }
                },
                position: [ 0, -0.25, -0.050 ],
                quaternion: [ 0, 0, 0, 1 ]

            }
        ],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

    return {
        id: -1,
        name: "tool-menu",
        components: [
            //currentIndicator,
            {
                attrs: {
                    geometry: {
                        shape: "box",
                        size: [ 3, 0.1, 0.15 ]
                    },
                    material: {
                        color: 0x404040,
                        name: "plastic"
                    },
                    toolUI: {
                        menu: true
                    },
                    captureEvents: true // pass them to child components
                },
                quaternion: [0, 0, 0, 1],
                position: [ 0, 0, 0.444 ]
            },
            ...toolMenuIcons
        ],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        voxel: voxel || [ 0, 0, 0 ]
    }

}

export default toolMenu