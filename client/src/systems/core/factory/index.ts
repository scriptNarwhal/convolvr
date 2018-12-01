//@flow
import Convolvr from '../../../world/world'
import Component, { DBComponent } from '../../../model/component'
import Entity from '../../../model/entity'
// import * as THREE from 'three'
import * as THREE from 'three';
import { System } from '../..';
import { Vector3 } from 'three';
import { FactoryType, FactoryAttributeType, portal, GeometryShape, geometry, material, AttributeName } from '../../../model/attribute';
import { SpaceConfig } from '../../../model/space';
import { AnyObject } from '../../../util';
import EmoteSystem from '../../chat/emote';

export type GenerateAttrParams = {
    component: Component,
    anchor: boolean,
    args: [string, boolean, any, number[], number[], number[], string] 
}
export type GenerateComponentParams = {
    component: Component, 
    anchor: boolean, 
    args: [boolean, any, number[], number[], number[], string] 
};
export type GenerateEntityParams = {
    component: Component, 
    anchor: boolean, 
    args: [boolean, any[], number[], number[], number[], string]
}


export default class FactorySystem implements System {

    world: Convolvr
    dependencies = [["emote"]]

    private emote: EmoteSystem

    private rateLimit: number = 3; // calls to generate() per frame 
    private mustGenerate = false;
    private attributeQueue: GenerateAttrParams[] = [];
    private componentQueue: GenerateComponentParams[] = [];
    private entityQueue: GenerateEntityParams[] = [];
   

    private getSystemIcon = (presetName: AttributeName) => {
        const icon = this.emote.systemIcons[presetName];
        return icon ? icon : "🔧";
    }

    constructor (world: Convolvr) {
        this.world = world;
    }

    init (component: Component) { //console.log("factory component init ", component)
        let attr = component.attrs.factory

        if ( attr.autoGenerate !== false )
            setTimeout(()=>{ this.generate( component )}, 1000)
        
        return {
            generate: () => {
                this.generate( component )
            }
        }
    }

    public tick(delta: number, time: number) { 
        if (this.mustGenerate) {
            if (this.componentQueue.length > 0) {
                const toGenerate = this.componentQueue.shift(),
                    created = this.generateComponent.call(this, ...toGenerate.args);

                this.initGeneratedEntity(created, toGenerate.component, toGenerate.anchor)
            } else if (this.entityQueue.length > 0) {
                const toGenerate = this.entityQueue.shift(),
                    created = this.generateEntity.call(this, ...toGenerate.args);

                this.initGeneratedEntity(created, toGenerate.component, toGenerate.anchor)
            } else if (this.attributeQueue.length > 0) {
                const toGenerate = this.attributeQueue.shift(),
                    created = this.generateAttrEntity.call(this, ...toGenerate.args);

                this.initGeneratedEntity(created, toGenerate.component, toGenerate.anchor)
            } else {
                this.mustGenerate = false;
                this.rateLimit = 3;
            }
        } 
    }

    generate(component: Component, menuItem: boolean = true) {
        let attr:       any                  = component.attrs.factory,
            position:   Vector3              = component.entity.mesh.position,
            voxel:      number[]             = component.entity.voxel,
            entityPos:  number[]             = !!attr.anchorOutput ? [0, 0, 0] : position.toArray(),
            miniature:  boolean              = !!attr.miniature,
            type:       FactoryType          = attr.type,
            preset:     string               = attr.preset,
            attrName:   FactoryAttributeType = attr.attrName,
            data:       any                  = attr.data,
            quat:       number[]             = data ? data.quaternion : [0,0,0,1],
            components: DBComponent[]        = data ? data.components : [] as DBComponent[],
            created:    Entity               = null;
        
        if (!data) {
            console.warn("No data for factory to generate with")
            return
        }
        if ( type == 'entity' ) {
            if (this.rateLimit > 0) {
                created = this.generateEntity( menuItem, components, voxel, entityPos, quat, preset )
                this.rateLimit --;
            } else {
                this.entityQueue.push({ component, anchor: attr.anchorOutput, args: [ menuItem, components, voxel, entityPos, quat, preset]});
                this.mustGenerate = true;
                return;
            }
           
        } else if (type == 'component') {
            if (this.rateLimit > 0) {
                created = this.generateComponent( menuItem, data, voxel, entityPos, quat, preset );
                this.rateLimit --;
            } else {
                this.componentQueue.push({ component, anchor: attr.anchorOutput, args: [menuItem, data, voxel, entityPos, quat, preset]});
                this.mustGenerate = true;
                return;
            }
            
        } else if ( type == 'attr' ) {
            if (this.rateLimit > 0) {
                created = this.generateAttrEntity(attrName, menuItem, data, voxel, entityPos, quat, preset);
                this.rateLimit --;
            } else {
                this.attributeQueue.push({ component, anchor: attr.anchorOutput, args: [attrName, menuItem, data, voxel, entityPos, quat, preset]});
                this.mustGenerate = true;
                return;
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

        this.initGeneratedEntity(created, component, attr.anchorOutput)
    }

    private initGeneratedEntity (created: Entity, component: Component, anchorOutput: boolean) {
        if ( created != null ) {
            if (anchorOutput) {
                created.init(component.mesh)
            } else {
                created.init(this.world.three.scene)
            }

            if ( created.mesh != null ) {
                created.mesh.translateZ(0)
                created.update(created.mesh.position.toArray())
            }
        } else {
            console.error( "error generating entity", created);
        }
    }

    private generateAttrEntity(type: FactoryAttributeType, menuItem: boolean, data: any, voxel: number[], entityPos: number[], quat: number[], preset: string) {
        switch (type) {
            case "geometry":
            console.log("generate geometry", data)
                return this._generateGeometry( menuItem, data, voxel, entityPos, quat, preset)
            case "material":
                return this._generateMaterial( menuItem, data, voxel, entityPos, quat, preset)
            case "assets":
                return this._generateAsset( menuItem, data, voxel, entityPos, quat)
            case "systems":
                return this._generateSystem( menuItem, data, voxel, entityPos, quat, preset as AttributeName)
        }
    }

    private generateEntity(menuItem: boolean, components: DBComponent[], voxel: number[], position: number[], quaternion: number[], preset: string ) {
        let ent: Entity = null;

        if ( !! components && components.length > 0 ) {
            if (!components[0].attrs) {
                components[0].attrs = {};
            } 
            components[0].attrs.miniature = { }
            ent = new Entity( -1, components, position, quaternion, voxel )    
            if (menuItem) {
                let toolUIProp = {
                    configureTool: {
                        tool: 0,
                        preset
                    }
                }

                ent.components.forEach( (component: DBComponent) => {
                    if (!component.attrs) {
                        component.attrs = {};
                    }
                    component.attrs.toolUI = component.attrs.toolUI ? { ...component.attrs.toolUI, ...toolUIProp} : toolUIProp;
                })
            }
        }
        return  ent;
    }

    private generateComponent(menuItem: boolean, data: any, voxel: number[], position: number[], quaternion: number[], preset: string ) {
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

    _generateGeometry(menuItem: boolean, data: geometry, voxel: number[], position: number[], quaternion: number[], preset: string ) {
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

    _generateSystem(menuItem: boolean, data: any, voxel: number[], position: number[], quaternion: number[], preset: AttributeName ) {
        const getSystemIcon = this.getSystemIcon;

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
                        size: [ 1.5, 1.5, 1.5 ]
                    },
                    text: {
                        lines: [
                            `#${getSystemIcon(preset)}${preset}`,
                            ...(JSON.stringify(data).match(/.{1,20}/g) || [""])
                            ],
                        fontSize: 120,
                        color: "#00ff00",
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

    _generateMaterial(menuItem: boolean, data: material, voxel: number[], position: number[], quaternion: number[], preset: string ) {

        return new Entity(-1, [{
                attrs: Object.assign({}, {material: data}, {
                    mixin: true,
                    miniature: {},
                    geometry: {
                        shape: "sphere",
                        size: [ 2, 2, 2 ]
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

    _generateAsset(menuItem: boolean, data: any, voxel: number[], position: number[], quaternion: number[] ) {

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

    _generateSpace(menuItem: boolean, data: SpaceConfig, voxel: number[], position: number[], quaternion: number[] ) {
        return new Entity(-1, [{
            attrs: {
                    miniature: {},
                    portal: {
                        username: data.userName,
                        world: data.name
                    },
                    toolUI: {
                        configureTool: {
                            tool: 2,
                            preset: "portal",
                            data: {
                                user: data.userName,
                                world: data.name
                            } as portal
                        }
                    },  
                    material: {
                        name: "metal",
                        color: 0x00ffff // get actual world color here..
                    },
                    text: {
                        lines: [
                            data.name
                        ],
                        fontSize: 120,
                        color: "#00ffff",
                        background: "#000000",
                        label: false
                    },
                    geometry: {
                        shape: <GeometryShape>"box",
                        size: [2.25, 2.25, 2.05] as [number, number, number]
                    }
                }
            }
        ], position, quaternion, voxel)
    }

    _generatePlace(menuItem: boolean, data: any, voxel: number[], position: number[], quaternion: number[] ) {

         return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
                    portal: {
                        username: data.username,
                        world: data.world,
                        place: data.name
                    },
                    toolUI: {
                        configureTool: {
                            tool: 2,
                            data
                        }
                    },  
                    material: {
                        name: "metal",
                        color: 0xff8000
                    },
                    text: {
                        lines: [data.name],
                        fontSize: 120,
                        color: "#ff0000",
                        background: "#000000",
                        label: false
                    },
                    geometry: {
                        shape: "box",
                        size: [2.25, 2.25, 2.05]
                    }
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateFile(menuItem: boolean, data: any, voxel: number[], position: number[], quaternion: number[] ) {

        return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
                    file: {
                        filename: data
                        // implement
                    },
                    material: {
                        name: "metal",
                        color: 0x0080ff
                    },
                    text: {
                        lines: [data],
                        color: "#ff0000",
                        background: "#000000",
                        label: false
                    },
                    geometry: {
                        shape: "box",
                        size: [2.25, 2.25, 2.05]
                    }
                }
            )}
        ], position, quaternion, voxel)
    }

    _generateDirectory(menuItem: boolean, data: any, voxel: number[], position: number[], quaternion: number[] ) {

        return new Entity(-1, [{
            attrs: Object.assign({}, data, {
                    mixin: true,
                    miniature: {},
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
                        size: [2.25, 2.25, 2.05]
                    }
                }
            )}
        ], position, quaternion, voxel)
    }
}
