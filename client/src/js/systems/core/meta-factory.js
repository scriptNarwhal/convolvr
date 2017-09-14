export default class MetaFactorySystem {
    
    constructor ( world ) {

        this.world = world
        // This system will add factory components for sets of entities, components, systems by category.. 
        // Alternately a prop.source of "self" can be specified, in which case data is pulled from system prop.type if it exists in the component. 
        // TODO: implement prop.source == "component" and prop.componentPath = [1, 0... ]
    }

    init ( component ) { 
        
        let components     = component.components,
            prop           = component.props.metaFactory,
            assetType      = prop.type,
            category       = prop.propName,
            gridWidth      = prop.gridWidth || 3,
            gridSize       = prop.gridSize || 22000,
            vOffset        = prop.vOffset || -14000,
            sourceCategory = "none",
            factories      = [],
            presets        = [],
            preset         = "",
            source         = [],
            index          = 0,
            keys           = {},
            x              = 0,
            y              = 0

        if ( assetType == "component" ) {

            Object.keys( prop.dataSource ).map( name => {

                presets.push( name )
                source.push( prop.dataSource[ name ] )  

            })

        } else { 

            source = prop.dataSource

        }

        if ( typeof source == 'string' && source == 'self' ) {
            
            if ( assetType == "file" )
                            
                source = component.state.file.res.listFiles.data || []
                // entity will re-init after files load              
        }

        if ( typeof source.map == 'function') { // array of geometries / materials, components, entities, worlds, places, files, (directories could use source[category])

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
            
            sourceCategory = source[ category ] // structures, vehicles, media, interactivity
        
            Object.keys( sourceCategory ).map( ( key, a ) => { // vehicle, propulsion, control, etc

                let categorySystems = sourceCategory[ key ]
             
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

    _getPreset ( assetType, item, i, presets ) {

        //preset = assetType == "entity" ? item.name : preset
        //preset = assetType == "component" ? presets[ i ] : preset
        switch ( assetType ) {

            case "world":
            case "place":
            case "entity":
            case "material":
                return item.name
            break
            case "component":
                return presets[ i ]
            break
            case "geometry":
                return item.shape
            break

        }

    }

    _addComponent ( component, factoryItem, assetType, assetCategory, preset, x, y, i, gridSize, vOffset ) {

        let addTo = null,
            layout = {},
            systems = this.world.systems,
            pos = [ -gridSize / 6 + gridSize * (x-1), vOffset + gridSize * y, 24000 ]

        if ( component.props.layout ) {

            pos = [ 0, vOffset, 2500 ]
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

