export default class MetaFactorySystem {
    
    constructor (world) {

        this.world = world
        // this should only support a limited subset of things.. as not to cuase insanity :P
        // Ideally just entities & components (geometry, material, generic system) by category.. 
        // ** Making it easy to create tool option panels 

    }

    init (component) { 
        
        let components = component.components,
            prop = component.props.metaFactory,
            assetType = prop.type,
            source = prop.dataSource,
            category = prop.propName,
            gridWidth = prop.gridWidth || 3,
            gridSize = prop.gridSize || 20000,
            sourceCategory = "none",
            factories = [],
            keys = {},
            x = 0,
            y = 0
            
        if ( typeof source.map == 'function') { // array of geometries / materials, components, entities

            source.map((item, i) => {
                
                this._addComponent( component, item, assetType, category, x, y, gridSize)

                x ++

                if ( x >= gridWidth ) {

                    x = 0
                    y += 1

                } 

            })
            
        } else { // map through system categories
            
            sourceCategory = source[category]
            keys = Object.keys(sourceCategory) // structures, vehicles, media, interactivity
            
            keys.map(key => {
                
                x ++

                if ( x > gridWidth ) {

                    x = 0
                    y += 1

                } 

                this._addComponent( component, sourceCategory[key], assetType, "systems", x, y, gridSize)


            })

        }

    }

    _addComponent ( component, factoryItem, assetType, assetCategory, x, y, gridSize ) {

        let addTo = null

        if (!!component.state.tool) {

            addTo = component.state.tool.panel.components[1].components

        } else {

            addTo = component.components

        }

        addTo.push({
                props: {
                    factory: {
                        type: assetType,
                        data: factoryItem,
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
                position:  [ gridSize * (x-1), gridSize * y, 16000 ],
                quaternion: null
        })

    }
}

