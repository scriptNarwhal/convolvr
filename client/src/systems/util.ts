import { AnyObject } from "../util";

export type SystemDependency = [string, string]

export class DependencyInjector {
    private resolved = false;
    private deps: SystemDependency[] = [];
    /** [name in local scope (this.foo), path in world.systems][] */
    constructor(deps: [string, string][]) {
        this.deps = deps;
    }

    inject(system: AnyObject) {
        if (system.resolved) {
            return;
        }
        for (const dep of this.deps) {
           const path = dep[1].split("."),
                    length = path.length;

            if (length == 1) {
                (system as any)[dep[0]] = system.world.systems[dep[1]];
            } else {
                (system as any)[dep[0]] = system.world.systems[path[0]][path[1]];
            }
        }
        this.resolved = true;
    }
}