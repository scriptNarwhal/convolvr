import Component from "./component";
import { PropType } from './property'
import Systems from "../systems";

import * as THREE from 'three';
export enum BindingType {
    ATTRIBUTE = "attr",
    PROPERTY = "prop",
    CALL = "call",
    STATE = "state",
    POSITION = "position",
    ROTATION = "rotation",
    TEXTURE = "texture",
    CHILD_COMPONENT = "child"
}
type SourceData = string | any[] | any;
type TargetData = string | any[] | any;

export default class Binding  {
    private systems: Systems
    private component: Component;
    private sourceType: PropType;
    private targetType: BindingType;
    private source: any; 
    private value: any;     // source resolves to value
    private targetUri: any; 
    private target: any | any[];  // targetUri resolves to target

    constructor(systems: Systems, component: Component, source: SourceData, sourceType: PropType, targetUri: string, targetType: BindingType) {
        this.systems = systems;
        this.component = component;
        this.source = source;
        this.sourceType = sourceType;
        this.targetUri = targetUri;
        this.targetType = targetType;

        this.parseOrResolveSource(source, sourceType, ()=> {
            this.resolveTarget(this.source, targetUri, targetType);
            this.apply();
       })
        
    }

    public update(): void {
        this.parseOrResolveSource(this.source, this.sourceType, ()=> { this.apply() });
    }


    private parseOrResolveSource(source: SourceData, sourceType: PropType, callback: Function) {
        if (sourceType == PropType.AUDIO || sourceType == PropType.VIDEO || sourceType == PropType.IMAGE) {
            this.resolveSource(source, sourceType).then((value: any) => {
                this.value = value;
                callback();
            })
        } else {
            this.value = this.parseSource(source, sourceType);
            callback();
        }
    }

    private resolveSource(source: SourceData, type: PropType): Promise<any> {
        switch (type) {
            case PropType.IMAGE:
                return this.systems.assets.loadImage(source, {});
            case PropType.AUDIO:
                return this.systems.assets.loadSound(source);
            case PropType.VIDEO:
                return this.systems.assets.loadVideo(source);
        }
    }

    private parseSource(source: SourceData, type: PropType): any {
        switch (type) {
            case PropType.BOOLEAN:
            case PropType.NUMBER:
            case PropType.VEC2:
            case PropType.VEC3:
            case PropType.VEC4:
            case PropType.STRING:
            case PropType.ARRAY:
            case PropType.OBJECT:
            case PropType.ANY:
                return source;
            case PropType.COMPONENT:
                return 
            case PropType.FUNCTION:
                return source; // store function to evaluate later
            case PropType.EXPRESSION:
                // implement
                return // use ecs to evaluate expression
        }
    }

    private resolveTarget(source: any, targetUri: TargetData, type: BindingType): void {
        let c = this.component;

        switch(type) {
            case BindingType.ATTRIBUTE:
                this.target = [c.attrs, targetUri]; break;
            case BindingType.PROPERTY:
                this.target =[c.props, targetUri]; break;
            case BindingType.CALL:
            case BindingType.STATE:
                this.target = [c.state, targetUri]; break;
            case BindingType.POSITION:
                this.target = c.mesh.position; break;
            case BindingType.ROTATION:
                this.target = c.mesh.quaternion; break;
            case BindingType.TEXTURE:
                this.target = [c.mesh.material, 'map']; break;
            case BindingType.CHILD_COMPONENT:
                this.target = c.components; break;
            
        }
    }

    private apply(): void {
        let c = this.component;

        this.value = this.typeCheck();
        switch(this.targetType) {
            case BindingType.ATTRIBUTE:
            case BindingType.PROPERTY:
            case BindingType.STATE:
                this.target[0][this.target[1]] = this.value; break;
            case BindingType.CALL:
            
            case BindingType.POSITION:
            case BindingType.ROTATION:
                this.target.fromArray(this.value); break;
            case BindingType.TEXTURE:
               this.target[0][this.target[1]] = this.value; break;
                // = source;
                //c.mesh.material.needsUpdate = true;
           
            case BindingType.CHILD_COMPONENT:
                this.target = this.value;//.push(source);
            
        }
    }

    private typeCheck(): any {
        let c = this.component;

        switch(this.targetType) {
            case BindingType.ATTRIBUTE:
            case BindingType.PROPERTY:
                return this.value;
            case BindingType.CALL:
            case BindingType.STATE:
                return this.value;
            case BindingType.POSITION:
            case BindingType.ROTATION:
                return this.value;
            case BindingType.TEXTURE:
                switch(this.sourceType) { 
                    case PropType.BOOLEAN:
                    case PropType.NUMBER:
                    case PropType.STRING:
                    case PropType.ARRAY:
                    case PropType.OBJECT:
                    case PropType.COMPONENT:
                    case PropType.FUNCTION:
                    case PropType.EXPRESSION:
                    case PropType.ANY:
                        // implement rendering text with text system
                        return this.dataToJSONMaterial(this.value, this.sourceType);
                    case PropType.VEC2:
                        this.value = [...this.value, ...this.value, 0];
                    case PropType.VEC3:
                    case PropType.VEC4:
                        return this.vectorToColorMaterial(this.value, this.sourceType);
                }
            break;

            case BindingType.CHILD_COMPONENT:
                return this.value;
            
        }
    }

    private dataToJSONMaterial(value: any, sourceType: PropType): any {
        
    }

    private vectorToColorMaterial(value: any, sourceType: PropType): any {
        let color = new THREE.Color();

        color.setRGB(this.value[0], this.value[1], this.value[2]);

        let material = new THREE.MeshLambertMaterial({ color }),
            transparent = sourceType == PropType.VEC4;

        material.opacity = transparent ? this.value[3] : 0;
        material.transparent = transparent;
        return material
    }
}