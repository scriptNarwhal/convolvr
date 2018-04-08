//@flow
import Binding from './binding';

enum PropertyType {
    BOOLEAN = "bool",
    NUMBER = "number",
    STRING = "string",
    ARRAY = "array",
    OBJECT = "object",
    COMPONENT = "component",
    PROPERTY = "prop",
    ATTRIBUTE = "attr",
    ANY = "any"
};

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