export default class LayoutSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { 
        
        let ownProp = component.props.layout,
            prop = component.parent && component.parent.props.layout ? component.parent.props.layout : false,
            siblings = component.parent && component.parent.components.length,
            position = [ 0, 0, 0 ] // use parent layout to position child
            index = component.index
       
        switch ( prop.type ) {

        case "list":
            position = this.listLayout( component, position, index, prop.isometric )
        break
        case "grid":
            position = this.gridLayout( component, position, index, prop.isometric )
        break
        case "radial":
            position = this.radialLayout( component, position, index, prop.isometric )
        break
        case "tube":
            position = this.tubeLayout( component, position, index, prop.isometric )
        break
        case "fibonacci":
            position = this.fibonacciLayout( component, position, index )
        break
        
        }

        component.mesh.position.fromArray( position )
        component.mesh.updateMatrix()

        return {
            type: prop.type
        }
    }

    listLayout ( component, position, index, isometric ) {

        
        return position
    }

    gridLayout ( component, position, index, plane, isometric ) {

        if ( plane == 'xy' ) {

            

        } else if ( plane == 'zy' ) {



        } else if ( plane == 'xz') {

            

        }

        return position

    }

    radialLayout ( component, position, index,  axis, isometric ) {

        //TODO: Implement P2
        return position
    }

    tubeLayout ( component, position, index,  axis, isometric ) {

        //TODO: Implement P2
        return position
    }

    fibonacciLayout ( component, position, index ) {

        //TODO: Implement P3
        return position

    }
}