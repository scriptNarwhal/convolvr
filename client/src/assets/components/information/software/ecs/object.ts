import { DBComponent } from "../../../../../core/component";

export default class ECSObjects {

    public static null = {
        id: -1,
        name: "object-null",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Null",
                        "null"
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    };

    public static int = {
        id: -1,
        name: "object-int",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Int",
                        "0"
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    }

    public static float = {
        id: -1,
        name: "object-float",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Float",
                        "0.0"
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    }

    public static string =  {
        id: -1,
        name: "object-string",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "String",
                        "\"\""
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    };

    public static array = {
        id: -1,
        name: "object-array",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Array",
                        "[ ]"
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    };
    
    public static hash = {
        id: -1,
        name: "object-hash",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "HashMap",
                        "{ }"
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    }

    public static function = {
        id: -1,
        name: "object-function",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Function",
                        "fn( ) { }"
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    }

    public static builtin = {
        id: -1,
        name: "object-builtin",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Builtin",
                        "{Builtin}"
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    }

    public static error = {
        id: -1,
        name: "object-error",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [2, 1, 1]
                },
                material: {
                    color: 0xff8000,
                    name: "metal"
                },
                text: {
                    lines: [
                        "Error",
                        "\"\""
                    ],
                    fontSize: 170,
                    color: "#ff8000",
                    background: "#000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["ecs-object"]
    }
}