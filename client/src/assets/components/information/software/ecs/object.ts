import { DBComponent } from "../../../../../core/component";

export default class ECSObjects {

    public static null = {
        id: -1,
        name: "object-null",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Null",
                        "Value: Null"
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    };

    public static int = {
        id: -1,
        name: "object-int",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Int",
                        "Value: 0"
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static float = {
        id: -1,
        name: "object-float",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Float",
                        "Value: 0.0"
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static string =  {
        id: -1,
        name: "object-string",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "String",
                        "Value: \"\""
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    };

    public static array = {
        id: -1,
        name: "object-array",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Array",
                        "Value: [ ]"
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    };
    
    public static hash = {
        id: -1,
        name: "object-hash",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "HashMap",
                        "Value: { }"
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static function = {
        id: -1,
        name: "object-function",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Function",
                        "Value: fn( ) { }"
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static builtin = {
        id: -1,
        name: "object-builtin",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Builtin",
                        "Value: {Builtin}"
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static error = {
        id: -1,
        name: "object-error",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Error",
                        "Value: \"\""
                    ],
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }
}