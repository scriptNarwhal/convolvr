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
            type = prop.type,
            source = prop.dataSource,
            propName = prop.propName,
            gridWidth = prop.gridWidth || 4,
            gridSize = prop.gridSize || 7000,
            factories = [],
            x = 0,
            y = 0

        source.map((item, i) => {

            components.push({
                props: {
                    factory: {
                        type,
                        data: item,
                        propName
                    }
                },
                position:  [gridSize * x, gridSize * y, 0 ],
                quaternion: null
            })

            x ++

            if ( x > gridWidth ) {

                x = 0
                y += 1

            } 

        })

    }
}

