import Convolvr from '../../../world/world'
import Component, { DBComponent } from '../../../core/component'
import Entity from '../../../core/entity'
import LayoutSystem from '../../ui/layout';

export default class TemplateSystem {
    
    private world: Convolvr
    private layout: LayoutSystem

    constructor(world: Convolvr) {
        this.world = world;
    }

    public init(component: Component) { 
        let attr:           any                   = component.attrs.template,
            assets:         {[key:string]:string} = attr.assets,
            textMap:        string[] | string[][] = attr.textMap,
            gridWidth:      number                = attr.gridWidth || 3,
            gridSize:       number                = attr.gridSize || 1,
            vOffset:        number                = attr.vOffset || -1.2,
            index:          number                = 0,
            keys:           any                   = {},
            x:              number                = 0,
            y:              number                = 0,
            z:              number                = 0

        
    }


    private addObject(
        component: Component, 
        newComponent: DBComponent,
        assetName: string, 
        preset: any, 
        x: number, 
        y: number,
        verticalOffset: number,
        idx: number,
        gridSize: number
    ) {
        let layout:  any         = {},
            pos:     Array<number> = [-gridSize / 6 + gridSize * (x-1), 0 + gridSize * y, 0.12+gridSize * verticalOffset]

        if (component.attrs.layout) {
            pos = [ 0, 0, 0.1 ]
            layout = component.attrs.layout
            pos = this.layout.useLayout( layout.type, component, pos, idx, layout.axis, layout.columns || 3, layout.gridSize || gridSize, layout.isometric)
        }


        /* then, using the position..  place the new component */
    }
}

/**
{
	template: {
		mode: "component",
		assets: {
			"_":"component-foo",
			"|":"component-bar"
		},
		textMap: [
			"________________",
			"|              |",
			"|              |",
			"|              |",
			"|              |",
			"|______________|",
		]
    },
    layout: {

    }
}
 * 
 */