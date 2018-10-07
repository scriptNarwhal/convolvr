import Component from "../../core/component";
import Convolvr from "../../world/world";
import { layout } from "../../core/attribute";

export default class LayoutSystem {

    private world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    public init(component: Component) { 
        
        let ownProp = component.attrs.layout,
            attr = component.parent && component.parent.attrs.layout ? component.parent.attrs.layout : {} as layout,
            siblings = component.parent && component.parent.components.length,
            position = [ 0, 0, 0 ], // use parent layout to position child
            index = component.index

        if ( (attr && !!!attr.mode) && ownProp.mode != "factory" ) {
            attr.gridSize = attr.gridSize == null ? 3 : 0
            position = this.useLayout( attr.type, component, position, index, attr.axis, attr.columns, attr.gridSize, attr.isometric)
            component.mesh.position.fromArray( position )
            component.mesh.updateMatrix()
        }

        return {
            type: attr.type
        }
    }

    public useLayout ( name: string, component: Component, position = [0,0,0], index: number, axis: string, columns = 3, gridSize = 0.66, isometric = false ) {

        let pos = [ 0, 0, 0 ]

        switch ( name ) {
            case "list":
                pos = this.listLayout( component, position, index, axis, gridSize)
            break
            case "grid":
                pos = this.gridLayout( component, position, index, axis, columns, gridSize, isometric )
            break
            case "radial":
                pos = this.radialLayout( component, position, index, axis, columns, gridSize, isometric )
            break
            case "tube":
                pos = this.tubeLayout( component, position, index, axis, columns, gridSize, isometric )
            break
            case "fibonacci":
                pos = this.fibonacciLayout( component, position, index, columns, gridSize )
            break
        }
        return [ pos[0] + position[0], pos[1] + position[1], pos[2] + position[2] ]
    }

    private listLayout (component: Component, position: number[], index: number, axis = "xy", gridSize: number) {
        let pos = [ 0, index * gridSize, 0 ]

        return pos
    }

    private gridLayout (component: Component, position: number[], index: number, axis = "xy", columns: number, gridSize: number, isometric: boolean ) {
        let x = index % columns,
            z = Math.max( 0, Math.floor( (index) / columns ) ),
            size = gridSize * 1.15,
            margin = -size,
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

    private radialLayout (component: Component, position: number[], index: number, axis = "xy", columns: number, gridSize: number, isometric: boolean ) {

        //TODO: Implement P2
        let pos = [ 0, index * gridSize, 0 ]
        
        return pos
    }

    private tubeLayout (component: Component, position: number[], index: number, axis = "z", columns: number, gridSize: number, isometric: boolean ) {
        let x = index % columns,
            z = Math.max( 0, Math.floor( (index) / columns ) ),
            margin = gridSize,
            marginZ = 2 * margin,
            columnWidth = 2*Math.PI / columns,
            pos = [ 0, 0, 0 ],
            xPos = 0,
            zPos = 0,
            yPos = 0

        if ( axis == 'x' ) {
            xPos = z * gridSize
            yPos = Math.sin(x * columnWidth) * gridSize
            zPos = Math.cos(z * columnWidth) * gridSize
        } else if ( axis == 'y' ) {
            yPos = z * gridSize
            xPos = Math.sin(x * columnWidth) * gridSize
            zPos = Math.cos(x * columnWidth) * gridSize
        } else if ( axis == 'z') {
            zPos =z * gridSize
            xPos = Math.sin(x * columnWidth) * gridSize
            yPos = Math.cos(z * columnWidth) * gridSize
        }
        pos = [ xPos, yPos, zPos +marginZ ]
        return pos
    }

    private fibonacciLayout ( component: Component, position: number[], index: number, columns: number, gridSize: number ) {

        //TODO: Implement P3
        // https://www.google.ca/search?q=fibonacci+grid&tbm=isch&source=iu&ictx=1&fir=JRP5xTh1mqh_CM%253A%252CjFxyq9GcN98ZtM%252C_&usg=__LK6T9856lEyJ4_83zhhRViZkBME%3D&sa=X&ved=0ahUKEwj6t_XwwbjbAhVn7YMKHdATBiIQ9QEILjAA#imgrc=JRP5xTh1mqh_CM:
        let pos = [ 0, index * gridSize, 0 ]
        
        return pos
    }
}