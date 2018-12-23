import Systems, { System } from '..';
import { AnyObject } from '../../util';
import Convolvr from '../../world/world';
import Component from '../../model/component';
import terminal from '../../assets/entities/information/hardware/terminal';

export enum PipelinedResourceType {
    Component = "component",
    // TODO: sub-component
    Entity = "entity"
}

export type PipelinedResource = {
    type: PipelinedResourceType
    args: any[]
}

/**
 * 
 */
export default class PipelineSystem implements System {
    
    world: Convolvr;
    systems: Systems

    private queue: PipelinedResource[] = [] as PipelinedResource[];

    public enqueue(item: PipelinedResource) {
        this.queue.push(item);
    }

    constructor(world: Convolvr) {
        this.world = world;
    }

    postInject?: () => void;

    init = (component: Component) => {


        return { foo: "bar" };
    };
    
    tick = (delta: number, time: number) => {
        while (this.queue.length > 0) {

        }
    };

    
    private dispatch(item: PipelinedResource) {
        switch (item.type) {
            case PipelinedResourceType.Component:
            
            break;
            // TODO: SubComponent
            case PipelinedResourceType.Entity:
            
            break;
        }
    }



 
    

}