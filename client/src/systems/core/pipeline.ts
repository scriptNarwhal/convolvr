import Systems, { System } from '..';
import { AnyObject } from '../../util';
import Convolvr from '../../world/world';
import Component from '../../model/component';
import Entity from '../../model/entity';

import * as THREE from 'three';

export enum PipelinedResourceType {
    Component = "component",
    MergedComponents = "merged-components",
    Entity = "entity"
}

export type PipelinedResource = {
    type: PipelinedResourceType
    entity?: Entity
    parentComponent?: Component
    component?: Component
    mergedGeometry?: THREE.Geometry
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
        const idealTime = time + 8;

        while (this.queue.length > 0  && Date.now() < idealTime) {
            this.emit(this.queue.shift());
        }
    };

    
    private emit(resource: PipelinedResource) {
        switch (resource.type) {
            case PipelinedResourceType.Entity:
                resource.entity.initEntity(resource.args[0], resource.args[1], resource.args[2]);
            break;
            case PipelinedResourceType.Component:

            break;
            case PipelinedResourceType.MergedComponents:
            // TODO: SubComponent
            break;
            
        }
    }

}