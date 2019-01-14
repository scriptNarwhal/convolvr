import Systems, { System, SystemDependency } from "..";
import { AnyObject } from "../../util";
import Convolvr from "../../world/world";
import Component from "../../model/component";
import Entity from "../../model/entity";

import * as THREE from "three";

export enum PipelinedResourceType {
    Component = 0,
    SubComponent = 1,
    MergedComponents = 2,
    CreateEntityMesh = 3,
    MergedSubComponents = 4,
    FinalMergedSubComponent = 5,
    Entity = 6
}

export type PipelinedResource = {
    type: PipelinedResourceType;
    entity?: Entity;
    callback?: Function;
    parentComponent?: Component;
    component?: Component;
    mergedGeometry?: THREE.Geometry;
    args?: any[];
};

/**
 *
 */
export default class PipelineSystem implements System {
    world: Convolvr;
    systems: Systems;
    dependencies = [] as SystemDependency[]

    private queue: PipelinedResource[] = [] as PipelinedResource[];
    private idealTime = 10;

    public enqueue(item: PipelinedResource) {
        this.queue.push(item);
    }

    public setIdealTime(time: number) {
        this.idealTime = time;
    }

    constructor(world: Convolvr) {
        this.world = world;
    }

    postInject?: () => void;

    init = (component: Component) => {
        return { foo: "bar" };
    };

    tick = (delta: number, time: number) => {
        const idealTime = time + this.idealTime,
            queue = this.queue;
 
        do {
            if (queue.length == 0) {
                break;
            }
            this.emit(queue.shift());    
        } while (Date.now() < idealTime)
    };

    private emit(resource: PipelinedResource) {
        const args = resource.args;
        
       switch (resource.type) {
            case PipelinedResourceType.Entity:
                resource.entity.initEntity(args[0], args[1], args[2], args[3], args[4]);
                break;
            case PipelinedResourceType.Component:
            case PipelinedResourceType.MergedComponents:
                
                resource.entity.initSubComponent(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
                break;
            case PipelinedResourceType.CreateEntityMesh:
                resource.callback();
                break;
            case PipelinedResourceType.SubComponent:
                console.warn("enqueue merged component");
                break;
            case PipelinedResourceType.MergedSubComponents:
                console.warn("enqueue merged sub component");
                break;
        }
    }
}
