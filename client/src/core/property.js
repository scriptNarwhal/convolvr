//@flow
import Binding from './binding';

export const PROPERTY_TYPES = {
    BOOLEAN: "bool",
    NUMBER: "number",
    STRING: "string",
    ARRAY: "array",
    OBJECT: "object",
    COMPONENT: "component",
    PROPERTY: "prop",
    ATTRIBUTE: "attr",
    ANY: "any"
};

export type PropertyType = $Keys<typeof PROPERTY_TYPES>;

export default class Property  {

    type: PropertyType
    binding: Binding
    name: string
    
    constructor(type: PropertyType, name: string, binding: Binding) {
        this.type = type;
        this.name = name;
        this.binding = binding;
    }
};