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
            gridWidth = prop.gridWidth || 4,
            gridSize = prop.gridSize || 7000,
            factories = [],
            keys = {},
            x = 0,
            y = 0

        if (typeof source.map == 'function') { // array of geometries / materials, components, entities
            
            source.map((item, i) => {

                this._addComponent( component, assetType, item, category, x, y, gridSize)

                x ++

                if ( x > gridWidth ) {

                    x = 0
                    y += 1

                } 

            })
            
        } else { // map through system categories

            sourceCategory = source[category]
            keys = Object.keys(sourceCategory) // structures, vehicles, media, interactivity
            
            keys.map(key => {

                this._addComponent( component, assetType, sourceCategory[key], category, x, y, gridSize)

                x ++

                if ( x > gridWidth ) {

                    x = 0
                    y += 1

                } 

            })

        }

    }

    _addComponent ( component, assetType, factoryItem, assetCategory, x, y, gridSize ) {

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
                        propName: assetCategory
                    }
                },
                position:  [ gridSize * x, gridSize * y, 0 ],
                quaternion: null
        })

    }
}

