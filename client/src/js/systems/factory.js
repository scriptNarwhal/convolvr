import Entity from '../entity'

export default class FactorySystem {

    constructor ( world ) {

        this.world = world

    }
  
    init ( component ) { //console.log("factory component init ", component) 
        
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

    generate ( component ) {

        let prop = component.props.factory,
            position = component.entity.mesh.position,
            entityPos = !!prop.anchorOutput ? [0, 0, 0] : position.toArray(),
            miniature = !!prop.miniature,
            type = prop.type,
            propName = prop.propName,
            data = prop.data,
            quat = data.quaternion,
            components = data.components,
            created = null
            
        if ( type == 'entity' ) {
 
            created = this._generateEntity( components, entityPos, quat )

        } else if (type == 'component') {

            created = this._generateComponent( data, entityPos, quat )

        } else if ( type == 'prop' ) {

            switch (propName) {

                case "geometry":
                    created = this._generateGeometry( data, entityPos, quat )
                break
                case "material":
                    created = this._generateMaterial( data, entityPos, quat )
                break
                case "assets":
                    created = this._generateAsset( data, entityPos, quat )
                break
                case "systems":
                    created = this._generateSystem( data, entityPos, quat )
                break

            }

        } else if ( type == "world" ) {

            created = this._generateWorld( data, entityPos, quat )

        } else if ( type == "place" ) {

            created = this._generatePlace( data, entityPos, quat )

        } else if ( type == "file" ) {

            created = this._generateFile( data, entityPos, quat )

        } else if ( type == "directory" ) {

            created = this._generateDirectory( data, entityPos, quat )

        }

        if ( !!prop.anchorOutput ) {

            created.init(component.mesh)

        } else {

            created.init(window.three.scene)

        }

        created.mesh.translateZ(-10000)
        created.update(created.mesh.position.toArray())

    }

    _generateEntity ( components, position, quaternion ) { 

        if ( !! components && components.length > 0 ) { // debugging this..
            
            components[0].props.miniature = { }
        
        }

        return  new Entity( -1, components, position, quaternion )

    }

    _generateComponent ( data, position, quaternion ) {

        data.props.miniature = { }
        return new Entity( -1, [ data ], position, quaternion )
    }

    _generateGeometry ( data, position, quaternion ) {

        return new Entity(-1, [{ 
                props: Object.assign({}, {geometry: data}, {
                    mixin: true,
                    miniature: {},
                    material: {
                        name: "wireframe",
                        color: 0xffffff
                    }
                }
            )}
        ], position, quaternion)

    }

    _generateSystem ( data, position, quaternion ) {

        return new Entity(-1, [{
            props: Object.assign({}, data, {
                    mixin: true,
                    material: {
                        name: "wireframe",
                        color: 0xffffff
                    },
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    }
                }
            )}
        ], position, quaternion)

    }

    _generateMaterial ( data, position, quaternion ) {

        return new Entity(-1, [{
                props: Object.assign({}, {material: data}, {
                    mixin: true,
                    geometry: {
                        shape: "sphere",
                        size: [4500, 4500, 4500]
                    }
                }
            )}
        ], position, quaternion)

    }

    _generateAsset ( data, position, quaternion ) {

        return new Entity(-1, [{
                props: Object.assign({}, {material: data}, {
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
                    }
                }
            )}
        ], position, quaternion)

    }

    _generateWorld ( data, position, quaternion ) {

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
        ], position, quaternion)

    }

    _generatePlace ( data, position, quaternion ) {

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
        ], position, quaternion)

    }

    _generateFile ( data, position, quaternion ) {

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
        ], position, quaternion)

    }

    _generateDirectory ( data, position, quaternion ) {

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
        ], position, quaternion)

    }

}

