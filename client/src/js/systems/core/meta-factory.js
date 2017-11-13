//@flow
import Convolvr from '../../world/world'
import Component from '../../component'
import Entity from '../../entity'
import * as THREE from 'three'

export default class MetaFactorySystem {
    
    world: Convolvr

    constructor ( world: Convolvr ) {

        this.world = world
        // This system will add factory components for sets of entities, components, systems by category.. 
        // Alternately a prop.source of "self" can be specified, in which case data is pulled from system prop.type if it exists in the component. 
        // TODO: implement prop.source == "component" and prop.componentPath = [1, 0... ]
    }

    init ( component: Component ) { 
        
        let components:     Array<Component> = component.components,
            prop:           Object           = component.props.metaFactory,
            assetType:      string           = prop.type,
            category:       string           = prop.propName,
            gridWidth:      number           = prop.gridWidth || 3,
            gridSize:       number           = prop.gridSize || 1,
            vOffset:        number           = prop.vOffset || -0.66,
            sourceCategory: any           = "none",
            factories:      Array<Object>    = [],
            presets:        Array<any>       = [],
            preset:         string           = "",
            source:         Array<any>       = [],
            index:          number           = 0,
            keys:           Object           = {},
            x:              number           = 0,
            y:              number           = 0

        if ( assetType == "component" ) {

            Object.keys( prop.dataSource ).map( name => {

                presets.push( name )
                source.push( prop.dataSource[ name ] )  

            })

        } else { 

            source = prop.dataSource

        }
        console.info("init metafactory prop ", prop)
        if ( typeof source == 'string' && source == 'self' ) {
            console.info( "source is string")
            if ( assetType == "file" )
                            
                source = component.state.file.res.listFiles.data || []
                // entity will re-init after files load              
        }

        if ( typeof source.map == 'function') { // array of geometries / materials, components, entities, worlds, places, files, (directories could use source[category])
            console.info( "source is ")
            source.map( (item, i) => {
                
                if ( assetType == 'entity' && typeof item == 'function' )
                
                    return
                
                preset = this._getPreset( assetType, item, i, presets ) 
                this._addComponent( component, item, assetType, category, preset, x, y, index, gridSize, vOffset)

                x ++

                if ( x >= gridWidth ) {

                    x = 0
                    y += 1

                } 

                index += 1

            })
            
        } else { // map through system categories
            console.info( "source is object")
            source = prop.dataSource
            sourceCategory = this._getSourceCategory( source, category ) // structures, vehicles, media, interactivity
        
            Object.keys( sourceCategory ).map( ( key, a ) => { // vehicle, propulsion, control, etc

                let categorySystems = sourceCategory[ key ]
             
                Object.keys( categorySystems ).map( systemPreset => {

                        this._addComponent( component, categorySystems[systemPreset], assetType, "systems", key,  x, y, index, gridSize, vOffset)
                        x += 1
                        index += 1
    
                        if ( x > gridWidth ) {
        
                            x = 0
                            y += 1
        
                        }

                }) 

            })

        }

    }

    _getSourceCategory ( source: any, category: string ) {

        let sourceCategory: any = ""
        console.info("get source CATEGORY", category, source)
        switch( category ) {

            case "structures": sourceCategory = source.structures; break;
            case "vehicles": sourceCategory = source.vehicles; break;
            case "media": sourceCategory = source.media; break;
            case "interactivity": sourceCategory = source.interactivity; break;

        }

        return sourceCategory

    }

    _getPreset ( assetType: string, item: Object, i: number, presets: Array<any> ) {

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

    _addComponent ( component: Component, factoryItem: any, assetType: string, assetCategory: string, preset: any, x: number, y: number, i: number, gridSize: number, vOffset: number ) {

        let addTo:   Component     = null,
            layout:  Object        = {},
            systems: Object        = this.world.systems,
            pos:     Array<number> = [ -gridSize / 6 + gridSize * (x-1), vOffset + gridSize * y, 0.120 ]

        if ( component.props.layout ) {

            pos = [ 0, vOffset, 0.1 ]
            layout = component.props.layout
            pos = systems.layout.useLayout( layout.type, component, pos, i, layout.axis, layout.columns || 3, layout.gridSize || gridSize, layout.isometric )

        }

        if ( !!component.state.tool ) {

            addTo = component.state.tool.panel.components[1].components

        } else {

            addTo = component.components

        }

        addTo.push({
                props: {
                    factory: {
                        type: assetType,
                        data: factoryItem,
                        preset,
                        propName: assetCategory,
                        anchorOutput: true
                    },
                    geometry: {
                        shape: 'node',
                        size: [1,1,1]
                    },
                    material: {
                        name: 'basic',
                        color: 0x000000
                    }
                },
                position:  pos,
                quaternion: null
        })

    }
}

