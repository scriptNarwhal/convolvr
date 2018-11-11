import { BindingType } from './binding';

export enum PropType {
    BOOLEAN = "bool",
    NUMBER = "number",
    VEC2 = "vec2",
    VEC3 = "vec3",
    VEC4 = "vec4",
    STRING = "string",
    ARRAY = "array",
    OBJECT = "object",
    ATTRIBUTE = "attr",
    PROPERTY = "prop",
    BINDING = "binding",
    CALLBACK = "callback",
    FUNCTION = "func",
    EXPRESSION = "expr",
    IMAGE = "image",
    AUDIO = "audio",
    VIDEO = "video",
    COMPONENT = "component",
    ANY = "any"
};

type Property = {
    name?: string,
    type: PropType,
    value: string | any,
    bindingType: BindingType
    binding: string,
};

export default Property;