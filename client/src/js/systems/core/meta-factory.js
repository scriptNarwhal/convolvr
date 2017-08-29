export default class MetaFactorySystem {
    
    constructor ( world ) {

        this.world = world
        // this should only support a limited subset of things.. as not to cuase insanity :P
        // Ideally just entities & components (geometry, material, generic system) by category.. 
        // ** Making it easy to create tool option panels 

    }

    init ( component ) { 
        
        let components = component.components,
            prop = component.props.metaFactory,
            assetType = prop.type,
            source = [],
            category = prop.propName,
            gridWidth = prop.gridWidth || 3,
            gridSize = prop.gridSize || 22000,
            vOffset = prop.vOffset || -12000,
            sourceCategory = "none",
            preset = "",
            presets = [],
            factories = [],
            keys = {},
            index = 0,
            x = 0,
            y = 0

        if ( assetType == "component" ) {

            Object.keys( prop.dataSource ).map( name => {

                presets.push( name )
                source.push( prop.dataSource[ name ] )  

            })

            console.log( "presets", presets )

        } else { 

            source = prop.dataSource

        }

        if ( typeof source.map == 'function') { // array of geometries / materials, components, entities, worlds, places, files, (directories could use source[category])

            source.map( (item, i) => {
                
                if ( assetType == 'entity' && typeof item == 'function' )
                
                    return
                

                preset = assetType == "entity" ? item.name : preset
                preset = assetType == "component" ? presets[ i ] : preset

                this._addComponent( component, item, assetType, category, preset, x, y, index, gridSize, vOffset)

                x ++

                if ( x >= gridWidth ) {

                    x = 0
                    y += 1

                } 

                index += 1

            })
            
        } else { // map through system categories
            
            sourceCategory = source[ category ] // structures, vehicles, media, interactivity
        
            Object.keys( sourceCategory ).map( ( key, a ) => { // vehicle, propulsion, control, etc

                let categorySystems = sourceCategory[ key ]
                console.log("***", sourceCategory, key)
                console.log( categorySystems )
                Object.keys( categorySystems ).map( systemPreset => {

                        this._addComponent( component, systemPreset, assetType, "systems", key,  x, y, index, gridSize, vOffset)
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

    _addComponent ( component, factoryItem, assetType, assetCategory, preset, x, y, i, gridSize, vOffset ) {

        let addTo = null,
            layout = {},
            systems = this.world.systems,
            pos = [ -gridSize / 6 + gridSize * (x-1), vOffset + gridSize * y, 24000 ]

        if ( component.props.layout ) {

            pos = [ 0, -14000, 0 ]
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

