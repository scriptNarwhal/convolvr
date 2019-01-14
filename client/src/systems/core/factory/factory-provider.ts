import Convolvr from '../../../world/world'
import Component, { DBComponent } from '../../../model/component'
import Entity, { DBEntity } from '../../../model/entity'
import { FactoryType, FactoryAttributeType } from '../../../model/attribute';
import { AnyObject } from '../../../util';
import AssetSystem from '../assets';

export default class FactoryProviderSystem {
    
    private world: Convolvr

    dependencies = [["assets"]]
    private assets: AssetSystem

    constructor(world: Convolvr) {

        this.world = world
        // This system will add factory components for sets of entities, components, systems by category.. 
        // Alternately a attr.source of "self" can be specified, in which case data is pulled from system attr.type if it exists in the component. 
        // TODO: implement attr.source == "component" and attr.componentPath = [1, 0... ]
    }

    public init(component: Component) { 
        
        let attr:           any                   = component.attrs.factoryProvider,
            assetType:      FactoryType           = attr.type,
            category:       FactoryAttributeType  = attr.attrName,
            gridWidth:      number                = attr.gridWidth || 3,
            gridSize:       number                = attr.gridSize || 1,
            vOffset:        number                = attr.vOffset || -1.2,
            sourceCategory: any                   = "none",
            factories:      Array<any>            = [],
            presets:        Array<any>            = [],
            preset:         string                = "",
            source:         Array<any>            = [],
            index:          number                = 0,
            keys:           any                   = {},
            x:              number                = 0,
            y:              number                = 0

        if ( assetType == "component" ) {
            Object.keys( attr.dataSource ).map( name => {
                presets.push( name )
                source.push( attr.dataSource[ name ] )  
            })
        } else { 
            source = attr.dataSource
        }
        //console.info("init factoryProvider attr ", attr)
        if (typeof source == 'string' && source == 'self' ) {
            console.info( "source is string", source)
            if ( assetType == "file" ) {
                source = component.state.file.res.listFiles.data || []
                // entity will re-init after files load
            }         
        }

        if (assetType == "world") {
            source = (this.assets || this.world.systems.byName.assets).spaces;
        }     

        if (source && typeof source.map == 'function') { // array of geometries / materials, components, entities, spaces, places, files, (directories could use source[category])
            //console.info( "factoryProvider source is ", source)
            const addItemFromList =  (item: AnyObject, i: number) => {
                if ( assetType == 'entity' && typeof item == 'function' ) { return }
                
                preset = this.getPreset( assetType, item, i, presets ) 
                this.addComponent( component, item, assetType, category, preset, x, y, index, gridSize, vOffset)
                x ++

                if ( x >= gridWidth ) {
                    x = 0
                    y += 1
                } 
                index += 1
            }
            if (attr.filter) {
                if (attr.filter.tags.length === 0) {
                    source.filter((item: DBComponent | DBEntity, index, all) => 
                       item.tags == null || item.tags.length == 0
                    ).map(addItemFromList);
                } else {
                    source.filter((item: DBComponent | DBEntity, index, all) => {
                        for (const tag of attr.filter.tags) {
                            if (item.tags && item.tags.indexOf(tag) > -1) {
                                return true;
                            }
                        }
                        return false;
                    }).map(addItemFromList);
                }
            } else {
                source.map(addItemFromList)
            }
            
            
        } else { // loop through system categories
            source = attr.dataSource
            if (!source) {
                console.warn("no source for meta-factory")
                return;
            }
            sourceCategory = this.getSourceCategory( source, category ) // structures, vehicles, media, interactivity
        
            const sourceKeys = Object.keys( sourceCategory );
            for (const key of sourceKeys) { // vehicle, propulsion, control, etc
                const categorySystems = sourceCategory[ key ]
                const categorySystemKeys = Object.keys(categorySystems);
                for (const systemPreset of categorySystemKeys)  {
                        this.addComponent( component, {[key]: categorySystems[systemPreset]}, assetType, "systems", key, x, y, index, gridSize, vOffset)
                        x += 1
                        index += 1
                        if ( x > gridWidth ) {
                            x = 0
                            y += 1
                        }
                } 
            }
        }

        return {
            generate: () => {
                this.init(component);
            }
        }
    }

    private getSourceCategory(source: any, category: string) {
        let sourceCategory: any = ""
        
        switch( category ) {
            case "structures": sourceCategory = source.structures; break;
            case "vehicles": sourceCategory = source.vehicles; break;
            case "media": sourceCategory = source.media; break;
            case "interactivity": sourceCategory = source.interactivity; break;
        }
        console.info("sourceCategory: ", sourceCategory)
        return sourceCategory
    }

    private getPreset( assetType: string, item: any, i: number, presets: Array<any> ) {
        let preset: string = ""

        switch ( assetType ) {
            case "world":
            case "place":
            case "entity":
            case "material":
                preset =  item.name
            break
            case "component":
                preset =  presets[ i ]
            break
            case "geometry":
                preset =  item.shape
            break
        }

        return preset
    }

    private addComponent(component: Component, factoryItem: any, assetType: FactoryType, assetCategory: FactoryAttributeType, preset: any, x: number, y: number, i: number, gridSize: number, vOffset: number ) {
        let addTo:   DBComponent[] = null,
            layout:  any         = {},
            systems: any         = this.world.systems,
            pos:     Array<number> = [ -gridSize / 6 + gridSize * (x-1), vOffset + gridSize * y, 0.120 ]
        // if (assetType === "file") {
        //     console.warn("its happening");
        //     console.info("factoryItem", factoryItem)
        // }
        if ( component.attrs.layout ) {
            pos = [ 0, vOffset, 0.1 ]
            layout = component.attrs.layout
            pos = systems.layout.useLayout( layout.type, component, pos, i, layout.axis, layout.columns || 3, layout.gridSize || gridSize, layout.isometric )
        }

        if ( !!component.state.tool ) {
            addTo = component.state.tool.panel.components[1].components
        } else {
            addTo = component.components
        }

        addTo.push({
                id: -1,
                name: "",
                components: [] as DBComponent[],
                props: {},
                state: {},
                tags: [],
                attrs: {
                    factory: {
                        type: assetType,
                        data: factoryItem,
                        preset,
                        attrName: assetCategory,
                        anchorOutput: true
                    },
                    geometry: {
                        shape: 'plane',
                        size: [0.1,0.1,0.1]
                    },
                    material: {
                        name: 'wireframe',
                        color: 0xffffff
                    }
                },
                position:  pos,
                quaternion: [0, 0, 0, 1]
        } as DBComponent)

    }
}

