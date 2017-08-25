export default class LayoutSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { 
        
        let ownProp = component.props.layout,
            prop = component.parent && component.parent.props.layout ? component.parent.props.layout : false,
            siblings = component.parent && component.parent.components.length,
            position = [ 0, 0, 0 ], // use parent layout to position child
            index = component.index

        if ( (prop && !!!prop.mode) && ownProp.mode != "factory" ) {

            prop.gridSize = prop.gridSize == null ? 3 : 0
            
            position = this.useLayout( prop.type, component, position, index, prop.axis, prop.columns, prop.gridSize, prop.isometric)
            
            component.mesh.position.fromArray( position )
            component.mesh.updateMatrix()

        }
        

        return {
            type: prop.type
        }
    }

    useLayout ( name, component, position = [0,0,0], index, axis, columns = 3, gridSize = 14000, isometric = false ) {

        let pos = [ 0, 0, 0 ]

        switch ( name ) {
            
            case "list":
                pos = this._listLayout( component, position, index, axis, gridSize)
            break
            case "grid":
                pos = this._gridLayout( component, position, index, axis, columns, gridSize, isometric )
            break
            case "radial":
                pos = this._radialLayout( component, position, index, axis, columns, gridSize, isometric )
            break
            case "tube":
                pos = this._tubeLayout( component, position, index, axis, columns, gridSize, isometric )
            break
            case "fibonacci":
                pos = this._fibonacciLayout( component, position, index, axis, columns, gridSize )
            break
                    
        }

        return [ pos[0] + position[0], pos[1] + position[1], pos[2] + position[2] ]

    }

    _listLayout ( component, position, index, axis, gridSize ) {

        let pos = [ 0, index * gridSize, 0 ]

        return pos

    }

    _gridLayout ( component, position, index, axis = "xy", columns, gridSize, isometric ) {

        let x = index % columns,
            z = Math.max( 0, Math.floor( (index) / columns ) ),
            margin = -gridSize,
            marginZ = 2 * margin / 3,
            pos = [ 0, 0, 0 ]

        if ( axis == 'xy' ) {

            pos = [ margin + (x * gridSize), z * gridSize, -marginZ ]

        } else if ( axis == 'zy' ) {

            pos = [ margin, z * gridSize, x * gridSize -marginZ ]

        } else if ( axis == 'xz') {

            pos = [ margin + (x * gridSize), 0, z * gridSize -marginZ ]

        }

        return pos

    }

    _radialLayout ( component, position, index, axis, columns, gridSize, isometric ) {

        //TODO: Implement P2
        let pos = [ 0, index * gridSize, 0 ]
        
        return pos
    }

    _tubeLayout ( component, position, index, axis, columns, gridSize, isometric ) {

        //TODO: Implement P2
        let pos = [ 0, index * gridSize, 0 ]
        
        return pos
    }

    _fibonacciLayout ( component, position, index, columns, gridSize ) {

        //TODO: Implement P3
        let pos = [ 0, index * gridSize, 0 ]
        
        return pos

    }
}