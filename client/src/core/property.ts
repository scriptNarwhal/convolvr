//@flow
import Binding from './binding';

export const PROPERTY_TYPES = {
    BOOLEAN: "bool",
    NUMBER: "number",
    STRING: "string",
    ARRAY: "array",
    OBJECT: "object",
    COMPONENT: "component",
    PROPERTY: "attr",
    ATTRIBUTE: "attr",
    ANY: "any"
};

export type PropertyType = $Keys<typeof PROPERTY_TYPES>;

export default class Property  {

    type: PropertyType
    binding: Binding
    bindingStr: string
    name: string
    
    constructor(type: PropertyType, name: string, binding: string) {
        this.type = type;
        this.name = name;
        this.bindingStr = binding;
    }

    bind() {
        // implement creating the binding object 
    }
};