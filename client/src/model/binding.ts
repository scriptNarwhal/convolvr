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
    public name: string;
    private systems: Systems
    private component: Component;
    private sourceType: PropType;
    private targetType: BindingType;
    private source: any; 
    private value: any;     // source resolves to value
    private targetUri: any; 
    private target: any | any[];  // targetUri resolves to target

    constructor(systems: Systems, component: Component, name: string, 
        source: SourceData, sourceType: PropType, targetUri: string, targetType: BindingType) {
        
        this.name = name;
        this.systems = systems;
        this.component = component;
        this.source = source;
        this.sourceType = sourceType;
        this.targetUri = targetUri;
        this.targetType = targetType;

        this.parseOrResolveSource(source, sourceType, ()=> {
            this.resolveTarget(this.source, targetUri, targetType);
            this.apply();
       });
    }

    public update(): void {
        this.parseOrResolveSource(this.source, this.sourceType, ()=> { this.apply() });
    }

    private parseOrResolveSource(source: SourceData, sourceType: PropType, callback: Function) {
        let nodeReference = (typeof source == 'string' && (source.indexOf("$parent") == 0 || source.indexOf("$sibling") == 0)),
            mustResolve = sourceType == PropType.AUDIO || sourceType == PropType.VIDEO || 
                          sourceType == PropType.IMAGE;

        if (nodeReference) {
            this.parseOrResolveSource(this.resolveNodeReference(source, sourceType), sourceType, callback);
        }
        if (mustResolve) {
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

    private resolveNodeReference(source: SourceData, sourceType: PropType): any {
        let nodeRef = source.split("."),
            hasIndex = nodeRef[0].indexOf("[")>-1,
            index = hasIndex ? nodeRef[0].split("[")[1].split("]")[0] : -1,
            refType = hasIndex ? nodeRef[0].split("[")[0] : nodeRef[0],
            node = null,
            sourcePath = nodeRef[1].indexOf(".") > -1 ? nodeRef[1].split(".") : nodeRef[1],
            resolved = null;
        
        if(refType == "$parent") {
            node = this.component.parent;
        } else if (refType == "$sibling") {
            node = this.component.parent.allComponents[index];
        }
        switch (sourceType) {
            case PropType.PROPERTY:
                return this.getAtPath(node.props[sourcePath[0]], sourcePath[1]);
            case PropType.ATTRIBUTE:
                return this.getAtPath((node.attrs as any)[sourcePath[0]], sourcePath[1]);
            case PropType.BINDING:
                let binding = node.getBindingByName(sourcePath);

                return binding ? (binding as Binding).getValue() : null;
            case PropType.CALLBACK:
                return node.state[sourcePath[0]].callbacks;
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
            case PropType.CALLBACK:
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
                this.target = this.getAtPath(c.state, this.target);
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
                if (this.target[1].indexOf('.') > -1){
                    this.setAtPath(this.value, this.target[0], this.target[1]);
                } else {
                    this.target[0][this.target[1]] = this.value;
                }
            break;
            case BindingType.CALL:
                let targetFunction = this.target;

                this.source.push(()=> {
                    targetFunction();
                });
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
        let name =  "generated_"+value.toString()+sourceType,
            textLines = JSON.stringify(value).match(/.{1,42}/g),
            text = this.systems.text,
            canvasSize = [1024, 1024],
            color = "#ffffff",
            background = "#000000",
            material = null,
            context: any = null,
            canvas: any = null,
            config = {};

        canvas = text.createTextCanvas(canvasSize);
        context = canvas.getContext("2d");
        text.renderText(context, textLines, color, background, canvasSize, config),
        material = text.createTextMaterial(canvas);
      
        return material;
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

    public getValue() {
        return this.value;
    } 

    private getAtPath (obj: {[key:string]:any}, path: string): any { // based off of https://stackoverflow.com/a/20424385/2961114
        let parts = path.split('.'),
            o = obj

        if ( parts.length > 1 ) {
            for (var i = 0; i < parts.length - 1; i++) {
                if (!o[parts[i]])
                    o[parts[i]] = {};
                o = o[parts[i]];
            }
        }
        return o[ parts[ parts.length - 1 ] ];
    }
    private setAtPath (value: any, obj: {[key:string]:any}, path: string): void { // based off of https://stackoverflow.com/a/20424385/2961114
        let parts = path.split('.'),
            o = obj

        if ( parts.length > 1 ) {
            for (var i = 0; i < parts.length - 1; i++) {
                if (!o[parts[i]])
                    o[parts[i]] = {};
                o = o[parts[i]];
            }
        }
        o[ parts[ parts.length - 1 ] ] = value;
    }
}