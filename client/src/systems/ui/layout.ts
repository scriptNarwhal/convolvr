import Component from "../../model/component";
import Convolvr from "../../world/world";
import { layout, LayoutAxis, LayoutOrientation, LayoutPlane } from "../../model/attribute";
import { System, SystemDependency } from "..";

export default class LayoutSystem implements System {
    world: Convolvr
    dependencies = [] as SystemDependency[]

    private readonly angleToXY = [
        [ 1,  0],
        [ 0, -1],
        [ -1, 0],
        [ 0,  1]
    ];

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
            attr.gridSize = attr.gridSize == null ? attr.gridSize : 0
            position = this.useLayout( attr.type, component, position, index, attr.axis, attr.columns, attr.gridSize, attr.isometric)
            component.mesh.position.fromArray( position )
            component.mesh.updateMatrix()
        }

        return {
            type: attr.type
        }
    }

    public useLayout(name: string, component: Component, position = [0,0,0], index: number, axis: LayoutOrientation, columns = 3, gridSize = 0.66, isometric = false) {
        let pos = [ 0, 0, 0 ]

        switch ( name ) {
            case "list":
                pos = this.listLayout( component, position, index, axis as LayoutAxis, gridSize)
            break
            case "grid":
                pos = this.gridLayout( component, position, index, axis as LayoutPlane, columns, gridSize, isometric )
            break
            case "radial":
                pos = this.radialLayout( component, position, index, axis as LayoutPlane, columns, gridSize, isometric )
            break
            case "tube":
                pos = this.tubeLayout( component, position, index, axis as LayoutAxis, columns, gridSize, isometric )
            break
            case "fibonacci":
                pos = this.fibonacciLayout( component, position, index, axis as LayoutAxis, columns, gridSize)
            break
        }
        return [ pos[0] + position[0], pos[1] + position[1], pos[2] + position[2] ]
    }

    private listLayout (component: Component, position: number[], index: number, axis: LayoutAxis = "y", gridSize: number): number[] {
        return axis == "x"
            ? [ index * gridSize, 0, 0 ]
            : axis == "y"
                ? [ 0, index * gridSize, 0 ]
                : [ 0, 0, index * gridSize ]
    }

    private gridLayout(component: Component, position: number[], index: number, axis: LayoutPlane = "xy", columns: number, gridSize: number, isometric: boolean ): number[] {
        let x = index % columns,
            z = Math.max( 0, Math.floor( (index) / columns ) ),
            size = gridSize * 1.15,
            margin = -size,
            marginZ = 2 * margin / 3;

        if ( axis == 'xy' ) {
            return [ margin + (x * gridSize), z * gridSize, -marginZ ]
        } else if ( axis == 'yz' ) {
            return [ margin, z * gridSize, x * gridSize -marginZ ]
        } else if ( axis == 'zx') {
            return [ margin + (x * gridSize), 0, z * gridSize -marginZ ]
        }
    }

    private radialLayout(component: Component, position: number[], index: number, axis: LayoutPlane = "xy", columns: number, gridSize: number, isometric: boolean ): number[] {
        const columnWidth = 2*Math.PI / columns,
            x = index % columns;
        //TODO: Implement P2
        let pos = [
            Math.sin(x * columnWidth) * gridSize,
            0,  
            Math.cos(x * columnWidth) * gridSize 
        ];
        
        return pos
    }

    private tubeLayout(component: Component, position: number[], index: number, axis: LayoutAxis = "z", columns: number, gridSize: number, isometric: boolean ): number[] {
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

    private fibonacciLayout(component: Component, position: number[], index: number, axis: LayoutAxis, columns: number, gridSize: number): number[] {
        let x = 0,
            r = 0,
            a = 0,
            y = 0,
            d = [],
            n = 1,
            p = 1;

        while (n < index) {
            p = n;
            n = n + p;
            a = r % 4;
            d = this.angleToXY[a];
            x += d[0] * n;
            y += d[1] * n;
            r ++;
        }
        
        return axis == "x" || axis == "z" ? [x * gridSize, 0, y * gridSize] : [x * gridSize, y * gridSize, 0];
    }
}