//@flow
import Convolvr from '../../world/world'
import Component from '../../component'
import Entity from '../../entity'
import { THREE } from 'three'

export default class FactorySystem {

    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world

    }
  

    init ( component: Component ) { //console.log("factory component init ", component) 
        
        let prop = component.props.factory
        
        if ( prop.autoGenerate !== false ) {
            
            setTimeout(()=>{

                this.generate( component )

            }, 1000)

        }

        return {

            generate: () => {

                this.generate( component )

            }

        }

    }

    generate ( component: Component ) {

        let prop:       Object           = component.props.factory,
            position:   THREE.Vector3    = component.entity.mesh.position,
            voxel:      Array<number>    = component.entity.voxel,
            entityPos:  Array<number>    = !!prop.anchorOutput ? [0, 0, 0] : position.toArray(),
            miniature:  boolean          = !!prop.miniature,
            type:       string           = prop.type,
            preset:     string           = prop.preset,
            propName:   string           = prop.propName,
            data:       Object           = prop.data,
            quat:       Array<number>    = data.quaternion,
            components: Array<Component> = data.components,
            created:    Entity           = null
            
        if ( type == 'entity' ) {
 
            created = this._generateEntity( components, voxel, entityPos, quat, preset )

        } else if (type == 'component') {

            created = this._generateComponent( data, voxel, entityPos, quat, preset )

        } else if ( type == 'prop' ) {

            switch ( propName ) {

                case "geometry":
                    created = this._generateGeometry( data, voxel, entityPos, quat )
                break
                case "material":
                    created = this._generateMaterial( data, voxel, entityPos, quat )
                break
                case "assets":
                    created = this._generateAsset( data, voxel, entityPos, quat )
                break
                case "systems":
                    created = this._generateSystem( data, voxel, entityPos, quat, preset )
                break

            }

        } else if ( type == "world" ) {

            created = this._generateWorld( data, voxel, entityPos, quat )

        } else if ( type == "place" ) {

            created = this._generatePlace( data, voxel, entityPos, quat )

        } else if ( type == "file" ) {

            created = this._generateFile( data, voxel, entityPos, quat )

        } else if ( type == "directory" ) {

            created = this._generateDirectory( data, voxel, entityPos, quat )

        }

        if ( created != null ) {

            if ( !!prop.anchorOutput ) {

                created.init(component.mesh)

            } else {

                created.init(window.three.scene)

            }

            if ( created.mesh != null ) {

                created.mesh.translateZ(-10000)
                created.update(created.mesh.position.toArray())

            }
            
        } else {

            console.error( "error generating entity", created, prop )

        }

    }

    _generateEntity ( components: Array<Component>, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) { 

        if ( !! components && components.length > 0 ) { // debugging this..
            
            components[0].props.miniature = { }
            components[0].props.toolUI = {
                configureTool: {
                    tool: 0,
                    preset
                }
            }
        
        }

        return  new Entity( -1, components, position, quaternion, voxel )

    }

    _generateComponent ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) {

        data.props.miniature = { }
        data.props.toolUI = {
            configureTool: {
                tool: 1,
                preset
            }
        }
        return new Entity( -1, [ data ], position, quaternion, voxel )
    }

    _generateGeometry ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{ 
                props: Object.assign({}, {geometry: data}, {
                    mixin: true,
                    miniature: {},
                    material: {
                        name: "wireframe",
                        color: 0xffffff
                    },
                    toolUI: {
                        configureTool: {
                            tool: 3,
                            preset: data.shape
                        }
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

    _generateSystem ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number>, preset: string ) {

        console.warn("system ", preset)

        return new Entity(-1, [{
            props: Object.assign({}, data, {
                    mixin: true,
                    material: {
                        name: "metal",
                        color: 0xffffff
                    },
                    geometry: {
                        shape: "box",
                        size: [12500, 12500, 4500]
                    },
                    text: {
                        lines: [preset],
                        color: 0xff0000,
                        label: false
                    },
                    toolUI: {
                        configureTool: {
                            tool: 2,
                            data
                        }
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

    _generateMaterial ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
                props: Object.assign({}, {material: data}, {
                    mixin: true,
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    },
                    toolUI: {
                        configureTool: {
                            tool: 4,
                            data
                        }
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

    _generateAsset ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
                props: Object.assign({}, {material: {diffuse: data}}, {
                    mixin: true,
                    assets: {
                        images: [data] 
                    },
                    material: {
                        name: "wireframe",
                        color: 0xffffff,
                        map: data
                    },
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    },
                    toolUI: {
                        configureTool: {
                            tool: 7,
                            data
                        }
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

    _generateWorld ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
            props: Object.assign({}, data, {
                    mixin: true,
                    portal: {
                        username: data.username,
                        world: data.name
                    }, 
                    material: {
                        name: "metal",
                        color: 0x00ffff // get actual world color here..
                    },
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

    _generatePlace ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

         return new Entity(-1, [{
            props: Object.assign({}, data, {
                    mixin: true,
                    portal: {
                        username: data.username,
                        world: data.world,
                        place: data.name
                    }, 
                    material: {
                        name: "metal",
                        color: 0xff8000 
                    },
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

    _generateFile ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
            props: Object.assign({}, data, {
                    mixin: true,
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
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

    _generateDirectory ( data: Object, voxel: Array<number>, position: Array<number>, quaternion: Array<number> ) {

        return new Entity(-1, [{
            props: Object.assign({}, data, {
                    mixin: true,
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
                        name: "wireframe",
                        color: 0x000000 
                    },
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    }
                }
            )}
        ], position, quaternion, voxel)

    }

}

