import Convolvr from '../../../world/world'
import Component, { DBComponent } from '../../../core/component'
import Entity from '../../../core/entity'

export default class TemplateSystem {
    
    private world: Convolvr

    constructor(world: Convolvr) {
        this.world = world;
    }

    public init(component: Component) { 
        let components:     Array<Component>      = component.components,
            attr:           any                   = component.attrs.template,
            assetType:      string                = attr.type,
            assets:         {[key:string]:string} = attr.assets,
            textMap:        string[] | string[][] = attr.textMap,
            dimensions:     number                = typeof assets[0] == 'string' ? 2 : 3,
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
        assetType: string, 
        assetCategory: string, 
        preset: any, 
        x: number, 
        y: number,
        z: number, 
        i: number, 
        gridSize: number,
        vOffset: number 
    ) {
        let layout:  any         = {},
            systems: any         = this.world.systems,
            pos:     Array<number> = [-gridSize / 6 + gridSize * (x-1), vOffset + gridSize * y, 0.12+gridSize * z]

        if ( component.attrs.layout ) {
            pos = [ 0, vOffset, 0.1 ]
            layout = component.attrs.layout
            pos = systems.layout.useLayout( layout.type, component, pos, i, layout.axis, layout.columns || 3, layout.gridSize || gridSize, layout.isometric)
        }

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