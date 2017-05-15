import Entity from '../entity'

export default class FactorySystem {

    constructor (world) {

        this.world = world

    }
 
    init ( component ) { 
        console.log("factory component init ", component)
        let prop = component.props.factory
        // render _something_ to indicate that it's a factory.. maybe 
        
        if (prop.autoGenerate !== false) {
            
            setTimeout(()=>{

                console.log("generate!!", prop)
                this.generate(component)

            }, 1000)

        }

        return {

            generate: () => {

                this.generate(component)

            }

        }

    }

    generate ( component ) {

        let prop = component.props.factory,
            position = component.entity.mesh.position,
            entityPosition = !!prop.anchorOutput ? [0, 0, 0] : position.toArray(),
            miniature = !!prop.miniature,
            type = prop.type,
            propName = prop.propName,
            data = prop.data,
            quat = data.quaternion,
            components = data.components,
            created = null
            
        if ( type == 'entity' ) {
 
            components[0].props.miniature = { }
            created = new Entity(-1, components, entityPosition, quat)

        } else if (type == 'component') {

            data.props.miniature = { }
            created = new Entity(-1, [data], entityPosition, quat)

        } else if ( type == 'prop' ) {
            // console.log("!!!!! factory init, propName: ", propName)
            switch (propName) {

                case "geometry":
                    created = new Entity(-1, [{ 
                        props: Object.assign({}, {geometry: data}, {
                                mixin: true,
                                miniature: {},
                                material: {
                                    name: "wireframe",
                                    color: 0xffffff
                                }
                            }
                        )}
                    ], entityPosition, quat)
                //    console.log("*** spawning geometry mixin component", created)
                break
                case "material":
                    created = new Entity(-1, [{
                            props: Object.assign({}, {material: data}, {
                                mixin: true,
                                geometry: {
                                    shape: "sphere",
                                    size: [4500, 4500, 4500]
                                }
                            }
                        )}
                    ], entityPosition, quat)
                    // console.log("*** spawning material mixin component", created)
                break
                case "assets":
                    created = new Entity(-1, [{
                            props: Object.assign({}, {material: data}, {
                                mixin: true,
                                assets: {
                                   images: [data] 
                                },
                                material: {
                                    name: "wireframe",
                                    color: 0xffffff,
                                    diffuse: data
                                },
                                geometry: {
                                    shape: "sphere",
                                    size: [4500, 4500, 4500]
                                }
                            }
                        )}
                    ], entityPosition, quat)
                break
                case "systems":
                    created = new Entity(-1, [{
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
                    ], entityPosition, quat)
                    // console.log("*** spawning system mixin component", created)
                break

            }
        }

        if ( !!prop.anchorOutput ) {

            created.init(component.mesh)

        } else {

            created.init(window.three.scene)

        }

        created.mesh.translateZ(-10000)
        created.update(created.mesh.position.toArray())

    }
}

