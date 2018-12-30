import Systems, { System } from "..";
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
        const idealTime = time + 8,
            queue = this.queue;
        if (queue.length > 0) {
            console.log(JSON.stringify(queue));
        }
        do {
            queue.length > 0 && this.emit(queue.shift());
        } while (Date.now() < idealTime)
    };

    private emit(resource: PipelinedResource) {
       switch (resource.type) {
            case PipelinedResourceType.Entity:
                resource.entity.initEntity(resource.args[0], resource.args[1], resource.args[2]);
                break;
            case PipelinedResourceType.Component:
            case PipelinedResourceType.MergedComponents:
                const args = resource.args;
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
