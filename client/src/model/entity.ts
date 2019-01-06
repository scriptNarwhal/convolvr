import { GRID_SIZE, API_SERVER, GLOBAL_SPACE } from "../config";
import Component from "./component";
import { DBComponent } from "./component";
import axios from "axios";
import Voxel from "./voxel";

export type DBEntity = {
    id: number;
    name: string;
    components: DBComponent[];
    position: number[];
    quaternion: number[];
    voxel?: number[];
    tags?: string[];
    boundingRadius?: number;
};

export type InitEntityConfig = {
    ignoreRotation?: boolean;
    updateWorkers?: boolean;
    noVoxel?: boolean;
};

enum WorkerUpdateMode {
    ADD = "add",
    UPDATE = "update",
    TELEMETRY = "update-telemetry",
    NONE = ""
}

import * as THREE from "three";
import { Vector3 } from "three";
import Systems from "../systems";
import { PipelinedResource, PipelinedResourceType } from "../systems/core/pipeline";
import Convolvr from "../world/world";
import { AnyObject } from "../util";

export default class Entity {
    public id: number;
    public components: DBComponent[];
    public position: number[] | false | null;
    public quaternion: number[] | false | null;
    public voxel: number[];
    public name: string;

    public mesh: any;
    public componentsByAttr: any; // arrays are defined here with key of attr
    public compsByFaceIndex: any; // possibly deprecated
    public allComponents: Component[];
    public combinedComponents: Component[];
    public oldCoords: number[];
    public boundingRadius = 0.5;
    public boundingBox: number[];
    public  tags: string[];

    private mount: any;
    private lastFace: number;
    private compPos: any;
    private handlers: any;

    public dimensions = [1, 1, 1];

    constructor(
        id: number,
        components: DBComponent[],
        position: number[],
        quaternion: number[],
        voxel: number[],
        name?: string,
        tags?: string[]
    ) {
        let world = (window as any).three.world;

        if (id == -1) {
            world && world.systems.assets.autoEntityID();
        }
        this.id = id;
        this.components = components ? components : [];
        this.position = position ? position : false;
        this.quaternion = quaternion ? quaternion : false;
        this.mesh = null;
        this.boundingRadius = 0.5; // set in init()
        this.componentsByAttr = {}; // arrays are defined here with key of attr
        this.compsByFaceIndex = []; // possibly deprecated
        this.allComponents = [];
        this.combinedComponents = [];
        this.voxel = voxel ? voxel : this.getVoxel(true);
        this.oldCoords = [...this.voxel];
        this.name = name || `entity${this.id}:${this.voxel.join("x")}`;
        this.lastFace = 0;
        this.compPos = new THREE.Vector3();
        this.tags = tags ? tags : [];
        this.handlers = {
            init: [],
            update: [],
            save: [],
            addToVoxel: [],
            removeFromVoxel: []
        };
    }

    public serialize(): DBEntity {
        return <DBEntity>{
            id: this.id,
            name: this.name,
            components: this.components,
            position: this.position,
            quaternion: this.quaternion,
            voxel: this.voxel,
            tags: this.tags,
            boundingRadius: this.boundingRadius
        };
    }

    public update(
        position: number[],
        quaternion?: number[],
        components?: DBComponent[],
        component?: DBComponent,
        componentPath?: number[],
        config = {}
    ) {
        let entityConfig = Object.assign({} as any, { updateWorkers: true }, config) as any;

        if (componentPath && componentPath.length > 0) {
            this.updateComponentAtPath(component, componentPath);
            this.init(this.mount, entityConfig);
        }
        if (components && components.length > 0) {
            this.components = components;
            this.init(this.mount, entityConfig);
        }
        if (position && this.mesh) {
            this.position = position;
            this.mesh.position.fromArray(position);
            if (this.voxel[1] != 1) {
                const newCoords = this.getVoxelCoords(position);
                if (newCoords[0] != this.voxel[0] || newCoords[2] != this.voxel[2] || newCoords[1] != this.voxel[1]) {
                    console.log("newCoords", newCoords, this.oldCoords);
                    this.oldCoords = [...this.voxel];
                    this.voxel = [...newCoords];
                    console.log("newCoords", newCoords, this.oldCoords);
                }
            }

            if (quaternion) {
                this.quaternion = quaternion;
                this.mesh.quaternion.fromArray(quaternion);
            }
            if ((config as any).updateWorkers !== false) {
                console.log("update workers");
                this.updateWorkers(WorkerUpdateMode.TELEMETRY, (window as any).three.world.systems, { oldCoords: this.oldCoords });
            }
            //this.updateOldCoords()
            this.mesh.updateMatrix();
        }

        this.callHandlers("update");
    }

    public addHandler(type: string, handler: Function): void {
        this.handlers[type].push(handler);
    }

    public callHandlers(type: string): void {
        let ent = this;

        this.handlers[type].forEach((handler: Function) => {
            handler(ent);
        });
    }

    public addTag(tagName: string): void {
        if (!this.hasTag(tagName)) {
            this.tags.push(tagName);
        }
    }

    public removeTag(tagName: string): void {
        let tagIndex = this._getTagIndex(tagName);

        if (tagIndex > -1) {
            this.tags.splice(tagIndex, 1);
        }
    }

    public hasTag(tagName: string): boolean {
        return this._getTagIndex(tagName) > -1;
    }

    private _getTagIndex(tagName: string) {
        return this.tags.indexOf(tagName);
    }

    public reInit() {
        this.init(this.mount, { updateWorkers: true });
    }

    public init(mount: THREE.Object3D, config: InitEntityConfig = {}, callback?: Function) {
        const three = (window as any).three,
            world = three.world as Convolvr,
            systems = world.systems;

        if (systems.testPerformance()) {
            return this.initEntity(world, systems, mount, config, callback);
        } else {
            return systems.pipeline.enqueue({
                type: PipelinedResourceType.Entity,
                entity: this,
                args: [world, systems, mount, config, callback]
            } as PipelinedResource);
        }
    }

    public initEntity(world: Convolvr, systems: Systems, mount: THREE.Object3D, config: InitEntityConfig = {}, callback?: Function) {
        let base = new THREE.Geometry(),
            three = world.three,
            mobile = world.mobile,
            nonMerged = [] as any[],
            compRadius = 0.5,
            materials = [] as any[],
            addToVoxel = true,
            workerUpdate: any = WorkerUpdateMode.NONE;

        this.lastFace = 0;
        this.componentsByAttr = {}; // reset before (re)registering components
        this.allComponents = [];

        if (this.mesh != null) {
            //world.octree.remove( this.mesh )
            if (this.mount) {
                this.mount.remove(this.mesh);
            } else {
                three.scene.remove(this.mesh);
            }
            this.removeFromVoxel(this.voxel);
            workerUpdate = !!config && config.updateWorkers ? "update" : workerUpdate;
        } else {
            workerUpdate = !!config && config.updateWorkers ? "add" : workerUpdate;
        }

        this.mount = mount;

        if (this.components.length == 0) {
            console.warn("Entity must have at least 1 component");
            return false;
        }

        const results = this.initSubComponents(systems, mobile, compRadius, materials, base, nonMerged),
          merged = results[0],
          noTime = results[1];

        addToVoxel = this.componentsByAttr.terrain != true && this.componentsByAttr.noRaycast != true;
        this.boundingRadius = Math.max(this.dimensions[0], this.dimensions[1], this.dimensions[2]);
        this.boundingBox = this.dimensions;
        !!workerUpdate && this.updateWorkers(workerUpdate, systems);

        
        if (noTime) {
          systems.pipeline.enqueue({
            type: PipelinedResourceType.CreateEntityMesh,
            callback: () => {
              this.initEntityMesh(world, config, merged, addToVoxel, nonMerged, base, materials, mount, callback)
            }
          });
        } else {
          this.initEntityMesh(world, config, merged, addToVoxel, nonMerged, base, materials, mount, callback)
        }

        return this;
    }

    private initEntityMesh(
      world: Convolvr, 
      config: InitEntityConfig,
      merged: number, 
      addToVoxel: boolean,
      nonMerged: THREE.Mesh[],
      base: THREE.Geometry, 
      materials: THREE.Material[], 
      mount: THREE.Object3D,
      callback: Function,  
    ) {
      let mesh: THREE.Mesh;
      
      if (merged > 0) {
        mesh = new THREE.Mesh(base, materials);
        mesh.matrixAutoUpdate = false;
      } else {
          mesh = nonMerged[0]; // maybe nest inside of Object3D ?
      }

      if (!mesh) {
          console.warn("entity mesh failed to generate", this);
          return;
      }

      if (world.settings.shadows > 0) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
      }

      merged = 1;

      while (merged < nonMerged.length) {
          mesh.add(nonMerged[merged]);
          merged++;
      }

      if (!!this.quaternion && (!config.ignoreRotation || this.components.length == 1)) mesh.quaternion.fromArray(this.quaternion);

      !!this.position && mesh.position.fromArray(this.position);

      mesh.userData = {
          entity: this,
          compsByFaceIndex: this.compsByFaceIndex
      };

      mount.add(mesh);
      this.mesh = mesh;

      if ((!!!config || !!!config.noVoxel) && addToVoxel) { this.addToVoxel(this.voxel, mesh); }

      mesh.updateMatrix();

      !!callback && callback(this);
      this.callHandlers("init");
    }

    private initSubComponents(
        systems: Systems,
        mobile: boolean,
        compRadius: number,
        materials: any[],
        base: any,
        nonMerged: any[]
    ): [number, boolean] {
        let ncomps = this.components.length,
            enoughTime = true,
            s = 0,
            c = 0;

        while (c < ncomps) {
            const component = this.components[c],
                isMerged = component && component.attrs.geometry && component.attrs.geometry.merge;

            if (enoughTime) {
                s = this.initSubComponent(c, s, component, systems, mobile, compRadius, materials, base, nonMerged);
            } else {
                systems.pipeline.enqueue({
                    type: isMerged ? PipelinedResourceType.MergedComponents : PipelinedResourceType.Component,
                    entity: this,
                    args: [c, s, component, systems, mobile, compRadius, materials, base, nonMerged]
                } as PipelinedResource);
            }
            
            enoughTime = (!enoughTime) ? false : !systems.testPerformance();
            c += 1;
        }

        return [s, !enoughTime];
    }

    public initSubComponent = (
        index: number,
        merged: number,
        component: DBComponent,
        systems: Systems,
        mobile: boolean,
        compRadius: number,
        materials: any[],
        base: THREE.Geometry,
        nonMerged: any[]
    ) => {
        let comp = null,
            compMesh,
            face = 0,
            faces = null,
            toFace = 0;

        comp = new Component(component, this, systems, { mobile, index, path: [index] }); // use simpler shading for mobile gpus
        compMesh = comp.mesh;
        if (!!!compMesh || !!!compMesh.geometry.computeBoundingSphere) {
            console.error("no geometry; aborting", index, this);
            return;
        }

        compMesh.geometry.computeBoundingSphere(); // check bounding radius
        compRadius = compMesh.geometry.boundingSphere.radius;
        if (index == 0) {
            const size = comp.attrs.geometry.size || [1, 1, 1];
            this.dimensions = [Math.max(1, size[0]), Math.max(1, size[1]), Math.max(1, size[2])];
        }
        this.dimensions = [
            Math.max(this.dimensions[0], Math.abs(compMesh.position.x) + compRadius),
            Math.max(this.dimensions[1], Math.abs(compMesh.position.y) + compRadius),
            Math.max(this.dimensions[2], Math.abs(compMesh.position.z) + compRadius)
        ];

        if (comp.attrs.geometry) {
            faces = compMesh.geometry.faces;
            face = faces.length - 1;
            toFace = this.lastFace + face;
            this.compsByFaceIndex.push({
                component: comp,
                from: this.lastFace,
                to: toFace
            });
            this.lastFace = toFace;
        }

        if (comp.merged) {
            this.combinedComponents.push(comp);
            materials.push(compMesh.material);
            compMesh.updateMatrix();
            while (face > -1) {
                faces[face].materialIndex = merged;
                face--;
            }
            base.merge(compMesh.geometry, compMesh.matrix);
            merged++;
        } else if (!comp.detached) {
            nonMerged.push(comp.mesh);
        }
        this.allComponents.push(comp);
        return merged;
    };

    public save(oldVoxel: any = false): Promise<any> {
        this.callHandlers("save");
        if (!!oldVoxel) {
            return this.saveUpdatedEntity(oldVoxel);
        } else {
            return this.saveNewEntity();
        }
    }

    private saveNewEntity(): Promise<any> {
        let data = this.serialize(),
            worldName = (window as any).three.world.name;

        return axios
            .put(`${API_SERVER}/api/import-to-world/${worldName}/${this.voxel.join("x")}`, data)
            .then((response: any) => {
                // console.info("Entity Saved", this)
            })
            .catch((response: any) => {
                console.error("Entity failed to save", response);
            });
    }

    private saveUpdatedEntity(oldVoxel: any): Promise<any> {
        let data = this.serialize(),
            worldName = (window as any).three.world.name;

        // console.info("save", data)
        // console.log("oldVoxel", oldVoxel, "newVoxel", this.voxel)
        return axios
            .put(`${API_SERVER}/api/update-space-entity/${worldName}/${this.voxel.join("x")}/${oldVoxel.join("x")}`, data)
            .then((response: any) => {
                // console.info("Entity Updated", this)
            })
            .catch((response: any) => {
                console.error("Entity failed to send update", response);
            });
    }

    public getVoxel(initial: boolean, check?: boolean) {
        const coords = this.getVoxelCoords(this.mesh != null ? this.mesh.position.toArray() : this.position, initial);

        if (check) {
            if (this.voxel[0] != coords[0] || this.voxel[2] != coords[2] || this.voxel[2] != coords[2]) {
                this.onVoxelChanged(coords);
            }
        }
        this.voxel = coords;
        return coords;
    }

    private getVoxelCoords(position?: number[], initial = false): number[] {
        if (this.voxel[1] != GLOBAL_SPACE[1] || this.voxel[0] != GLOBAL_SPACE[0] || this.voxel[2] != GLOBAL_SPACE[2]) {
            if (initial) {
                return [Math.floor(position[0] / GRID_SIZE[0]), 0, Math.floor(position[2] / GRID_SIZE[2])];
            } else {
                return this.voxel;
            }
        } else {
            return GLOBAL_SPACE;
        }
    }

    private onVoxelChanged(coords: number[]) {}

    public updateOldCoords() {
        this.oldCoords = [...this.voxel];
    }

    public addToVoxel(coords: number[], mesh: any) {
        let ent = this;

        this.getVoxelForUpdate(coords, (addTo: any) => {
            addTo.meshes.push(mesh);
            addTo.entities.push(ent);
        });
        this.callHandlers("addToVoxel");
    }

    public removeFromVoxel(coords?: number[], mesh?: any) {
        let removeFrom = this.getVoxelForUpdate(typeof coords === "object" ? coords : this.voxel),
            ent = this;

        mesh = mesh ? mesh : this.mesh;
        removeFrom.entities.splice(removeFrom.entities.indexOf(ent), 1);
        removeFrom.meshes.splice(removeFrom.meshes.indexOf(mesh), 1);
        this.callHandlers("removeFromVoxel");
    }

    public getVoxelForUpdate(coords: number[], callback?: Function): Voxel {
        let world = (window as any).three.world,
            thisEnt = this,
            systems = world.systems,
            space = systems.space,
            voxel = space.voxels[coords.join(".")];

        if (!!!voxel) {
            console.warn("voxel not loaded");
            voxel = space.loadVoxel(coords, callback);
        } else if (typeof voxel != "boolean") {
            callback && callback(voxel);
        } else {
            setTimeout(() => {
                let voxel = space.voxels[coords.join(".")];
                if (typeof voxel === "object") {
                    callback(voxel);
                } else {
                    space.loadVoxel(coords, callback);
                }
            }, 600);
        }
        return voxel;
    }

    public getComponentByPath(path: any[], pathIndex: number, components: Component[] | false = false): Component {
        let foundComponent = null;

        if (components == false) components = this.allComponents;
        if (pathIndex + 1 < path.length) {
            foundComponent = this.getComponentByPath(path, pathIndex + 1, components[path[pathIndex]].allComponents);
        } else {
            foundComponent = components[path[pathIndex]];
        }
        return foundComponent;
    }

    public updateComponentAtPath(
        component: DBComponent,
        path: any[],
        pathIndex = 0,
        components: DBComponent[] | false = false,
        resetState = false
    ) {
        let oldState: any = {},
            sanitizedState: any = {};

        if (components == false) {
            components = this.components;
        }
        if (pathIndex + 1 < path.length) {
            this.updateComponentAtPath(component, path, pathIndex + 1, components[path[pathIndex]].components);
        } else {
            if (resetState == false) {
                if (this.allComponents[path[pathIndex]]) {
                    oldState = this.allComponents[path[pathIndex]].state;
                } else {
                    console.warn("Error finding component state", path, pathIndex, path[pathIndex], this.allComponents);
                }
                if (oldState.tool || oldState.toolUI) {
                    sanitizedState = { tool: {}, toolUI: {} };
                }
            }
            component.state = Object.assign({}, oldState, component.state || {}, sanitizedState);
            components[path[pathIndex]] = component;
        }
    }

    private updateWorkers(mode: WorkerUpdateMode, systems: any, config: any = {}) {
        if (mode == WorkerUpdateMode.NONE) {
            return;
        }
        let entityData: any = {
                id: this.id,
                components: this.components,
                position: this.position,
                quaternion: this.quaternion,
                boundingRadius: this.boundingRadius,
                boundingBox: this.boundingBox
            },
            message: AnyObject = {};

        switch(mode) {
          case WorkerUpdateMode.ADD:
            message = {
              command: "add entity",
              data: {
                  coords: this.voxel,
                  entity: entityData
              }
            };
          break;
          case WorkerUpdateMode.UPDATE:
            message = {
                command: "update entity",
                data: {
                    entityId: this.id,
                    coords: this.voxel,
                    entity: entityData
                }
            };
          break;
          case WorkerUpdateMode.TELEMETRY:
            let newPosition = [...entityData.position];

            newPosition[0] -= this.boundingRadius / 2.0;
            newPosition[1] -= this.boundingRadius / 2.0;

            console.log("coords", this.voxel, "oldCoords", config.oldCoords);
            console.log("this old coords", this.oldCoords);
            message = {
                command: "update telemetry",
                data: {
                    entityId: this.id,
                    coords: this.voxel,
                    oldCoords: config.oldCoords,
                    position: newPosition,
                    quaternion: entityData.quaternion
                }
            };
        }
        
        systems.staticCollisions.worker.postMessage(JSON.stringify(message));
        //systems.oimo.worker.postMessage( message )
    }

    public getClosestComponent(position: Vector3, recursive = true) {
        let compPos = this.compPos,
            entMesh = this.mesh,
            worldCompPos = null,
            distance = 0.09,
            newDist = 0,
            closest: Component | null = null,
            closestSubComp = null;

        entMesh.updateMatrixWorld();
        for (const component of this.allComponents) {
            if (!!component.merged) {
                return false;
            }

            compPos.setFromMatrixPosition(component.mesh.matrixSpace); // get world position
            newDist = compPos.distanceTo(position);

            if (newDist < distance) {
                distance = newDist;
                closest = component;
            }
        }

        if (!!!closest) {
            distance = 0.09;
            newDist = 0;
            for (const component of this.combinedComponents) {
                if (component.data) {
                    compPos.fromArray(component.data.position);
                    worldCompPos = entMesh.localToWorld(compPos);
                    newDist = worldCompPos.distanceTo(position); //console.log("compPos", compPos, "worldCompPos", worldCompPos, "newDist", newDist)

                    if (newDist < distance) {
                        distance = newDist;
                        closest = component;
                    }
                }
            }
        }

        if (!!closest && recursive && closest.components.length > 1) {
            closestSubComp = closest.getClosestComponent(position);
            closest = !!closestSubComp ? closestSubComp : closest;
        }
        return closest;
    }

    public getComponentByFace(face: number) {
        let component = false;

        for (const comp of this.compsByFaceIndex) {
            if (face >= comp.from && face <= comp.to) {
                component = comp.component;
            }
        }

        return component;
    }
}
