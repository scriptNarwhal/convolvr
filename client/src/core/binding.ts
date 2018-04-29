import Component from "./component";
import { PropType } from './property'
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
    private component: Component;
    private source: any;
    private target: any;

    constructor(component: Component, source: SourceData, sourceType: PropType, target: string, targetType: BindingType) {
        this.component = component;
        this.resolve(source, sourceType, target, targetType);
    }

    public resolve(source: SourceData, sourceType: PropType, target: string, targetType: BindingType) {
        this.source = this.resolveSource(source, sourceType);
        this.target = this.resolveTarget(source, target, targetType);
    }

    private resolveSource(source: SourceData, type: PropType): any {
        switch (type) {
            case PropType.BOOLEAN:
            case PropType.NUMBER:
            case PropType.VEC2:
            case PropType.VEC3:
            case PropType.VEC4:
            case PropType.STRING:
            case PropType.ARRAY:
            case PropType.OBJECT:
                return source;
            case PropType.COMPONENT:
                return 
            case PropType.FUNCTION:
                return 
            case PropType.EXPRESSION:
                return // use ecs  to parse expression
            case PropType.IMAGE:
                return 
            case PropType.AUDIO:
                return 
            case PropType.VIDEO:
                return 
            case PropType.ANY:
                return 
        }
    }

    private resolveTarget(source: any, target: TargetData, type: BindingType): void {
        let c = this.component;
        switch(type) {
            case BindingType.ATTRIBUTE:
                c.attrs[target] = source; break;
            case BindingType.PROPERTY:
                c.props[target] = source; break;
            case BindingType.CALL:
            break;
            case BindingType.STATE:
                c.state[target] = source; break;
            case BindingType.POSITION:
                c.mesh.position.fromArray(source); break;
            case BindingType.ROTATION:
                c.mesh.quaternion.fromArray(source); break;
            case BindingType.TEXTURE:
                c.mesh.material.map = source;
                c.mesh.material.needsUpdate = true;
            break;
            case BindingType.CHILD_COMPONENT:
                c.components.push(source);
            break;
        }
    }
}