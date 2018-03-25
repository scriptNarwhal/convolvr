//@flow 

export const BINDING_TYPES = {
    ATTRIBUTE: "attr",
    PROPERTY: "attr",
    STATE: "state",
    MESH: "mesh"
}

type BindingType = $Keys<typeof BINDING_TYPES>;

export default class Binding  {
    constructor(type: BindingType, target: string, callback?: Function) {

    }
}