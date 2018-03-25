//@flow
import Convolvr from '../../../world/world'
import Component from '../../../core/component'
import Entity from '../../../core/entity'
import * as THREE from 'three'

export default class FactorySystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) { //console.log("factory component init ", component)

        let attr = component.attrs.factory

        if ( attr.autoGenerate !== false )
            setTimeout(()=>{ this.generate( component )}, 1000)
        
        return {
            generate: () => {
                this.generate( component )
            }
        }
    }

    generate(component: Component, menuItem: boolean = true) {
        let attr:       Object           = component.attrs.factory,
            position:   THREE.Vector3    = component.entity.mesh.position,
            voxel:      Array<number>    = component.entity.voxel,
            entityPos:  Array<number>    = !!attr.anchorOutput ? [0, 0, 0] : position.toArray(),
            miniature:  boolean          = !!attr.miniature,
            type:       string           = attr.type,
            preset:     string           = attr.preset,
            attrName:   string           = attr.attrName,
            data:       Object           = attr.data,
            quat:       Array<number>    = data ? data.quaternion : [0,0,0,1],
            components: Array<Component> = data ? data.components : [],
            created:    Entity           = null;

        if (!data) {
            console.warn("No data for factory to generate with")
            return
        }
        if ( type == 'entity' ) {
            created = this._generateEntity( menuItem, components, voxel, entityPos, quat, preset )
        } else if (type == 'component') {
            created = this._generateComponent( menuItem, data, voxel, entityPos, quat, preset )
        } else if ( type == 'attr' ) {

            switch ( attrName ) {
                case "geometry":
                    created = this._generateGeometry( menuItem, data, voxel, entityPos, quat, preset  )
                break
                case "material":
                    created = this._generateMaterial( menuItem, data, voxel, entityPos, quat, preset  )
                break
                case "assets":
                    created = this._generateAsset( menuItem, data, voxel, entityPos, quat )
                break
                case "systems":
                    created = this._generateSystem( menuItem, data, voxel, entityPos, quat, preset )
                break
            }

        } else if ( type == "world" ) {
            created = this._generateSpace( menuItem, data, voxel, entityPos, quat )
        } else if ( type == "place" ) {
            created = this._generatePlace( menuItem, data, voxel, entityPos, quat )
        } else if ( type == "file" ) {
            created = this._generateFile( menuItem, data, voxel, entityPos, quat )
        } else if ( type == "directory" ) {
            created = this._generateDirectory( menuItem, data, voxel, entityPos, quat )
        }

        if ( created != null ) {
            if ( !!attr.anchorOutput ) {
                created.init(component.mesh)
            } else {
                created.init(window.three.scene)
            }

            if ( created.mesh != null ) {
                created.mesh.translateZ(0)
                created.update(created.mesh.position.toArray())
            }
        } else {
            console.error( "error generating entity", created, attr )
        }
    }

    _generateEntity(menuItem: boolean, components: Array<Component>, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) {
        let ent: Entity = null;

        if ( !! components && components.length > 0 ) {
            components[0].attrs.miniature = { }
            ent = new Entity( -1, components, position, quaternion, voxel )    
            if (menuItem) {
                let toolUIProp = {
                    configureTool: {
                        tool: 0,
                        preset
                    }
                }

                ent.components.forEach( (component: Component) => {
                    component.attrs.toolUI = component.attrs.toolUI ? { ...component.attrs.toolUI, ...toolUIProp} : toolUIProp;
                })
            }
        }
        return  ent;
    }

    _generateComponent(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) {
        let newComponent = {
                ...data,
                attrs: {
                    ...data.attrs,
                    ...(menuItem ? {
                        toolUI: {
                            configureTool: {
                                tool: 1,
                                preset
                            }
                        },
                        miniature:{},
                    } : {})
                }
            };
            
        return new Entity( -1, [ newComponent ], position, quaternion, voxel )
    }

    _generateGeometry(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) {
        return new Entity(-1, [{
                attrs: Object.assign({}, {geometry: data}, {
                    mixin: true,
                    miniature: {},
                    material: {
                        name: "wireframe",
                        color: 0xffffff
                    },
                    ...(menuItem ? {
                        toolUI: {
                            configureTool: {
                                tool: 3,
                                preset: data,
                                data
                            }
                        }
                    } : {})
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateSystem(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) {
        return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
                    material: {
                        name: "metal",
                        color: 0xffffff
                    },
                    geometry: {
                        shape: "box",
                        size: [ 0.5, 0.5, 0.05 ]
                    },
                    text: {
                        lines: [
                            preset,
                            ...(JSON.stringify(data).match(/.{1,20}/g) || [""])
                            ],
                        fontSize: 80,
                        color: "#ffffff",
                        background: "#000000",
                        label: false
                    },
                    ...(menuItem ? {
                        toolUI: {
                            configureTool: {
                                tool: 2,
                                preset,
                                data
                            }
                        }
                    } : {})
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateMaterial(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) {

        return new Entity(-1, [{
                attrs: Object.assign({}, {material: data}, {
                    mixin: true,
                    miniature: {},
                    geometry: {
                        shape: "sphere",
                        size: [ 0.05, 0.05, 0.05 ]
                    },
                    ...(menuItem ? {
                        toolUI: {
                            configureTool: {
                                tool: 4,
                                data
                            }
                        }
                    } : {})
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateAsset(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
                attrs: Object.assign({}, {material: {diffuse: data}}, {
                    mixin: true,
                    miniature: {},
                    assets: {
                        images: [data]
                    },
                    material: {
                        name: "plastic",
                        color: 0xffffff,
                        map: data
                    },
                    geometry: {
                        shape: "box",
                        size: [0.5, 0.5, 0.5]
                    },
                    ...(menuItem ? {
                        toolUI: {
                            configureTool: {
                                tool: 7,
                                data
                            }
                        }
                    } : {})
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateSpace(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
                    portal: {
                        username: data.username,
                        world: data.name
                    },
                    toolUI: {
                        configureTool: {
                            tool: 5,
                            data
                        }
                    },  
                    material: {
                        name: "metal",
                        color: 0x00ffff // get actual world color here..
                    },
                    text: {
                        lines: [
                            data.name,
                            ...(JSON.stringify(data) .match(/.{1,20}/g) || [""])
                        ],
                        fontSize: 80,
                        color: "#ff0000",
                        background: "#000000",
                        label: false
                    },
                    geometry: {
                        shape: "box",
                        size: [0.25, 0.25, 0.05]
                    }
                }
            )}
        ], position, quaternion, voxel)
    }

    _generatePlace(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

         return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
                    portal: {
                        username: data.username,
                        world: data.world,
                        place: data.name
                    },
                    material: {
                        name: "metal",
                        color: 0xff8000
                    },
                    text: {
                        lines: [JSON.stringify(data)],
                        color: "#ff0000",
                        background: "#000000",
                        label: false
                    },
                    geometry: {
                        shape: "box",
                        size: [0.25, 0.25, 0.05]
                    }
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateFile(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
                    text: {
                        color: 0xffffff,
                        background: 0x000000,
                        lines: [
                            data
                        ]
                    },
                    file: {
                        filename: data
                        // implement
                    },
                    material: {
                        name: "metal",
                        color: 0x0080ff
                    },
                    text: {
                        lines: [JSON.stringify(data)],
                        color: "#ff0000",
                        background: "#000000",
                        label: false
                    },
                    geometry: {
                        shape: "box",
                        size: [0.25, 0.25, 0.05]
                    }
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateDirectory(menuItem: boolean, data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
                    text: {
                        color: 0xffffff,
                        background: 0x000000,
                        lines: [
                            data
                        ]
                    },
                    file: {
                        workingDir: data
                        // implement
                    },
                    material: {
                        name: "metal",
                        color: 0x000000
                    },
                    text: {
                        lines: [JSON.stringify(data)],
                        color: "#ff0000",
                        background: "#000000",
                        label: false
                    },
                    geometry: {
                        shape: "box",
                        size: [0.25, 0.25, 0.05]
                    }
                }
            )}
        ], position, quaternion, voxel)
    }
}
