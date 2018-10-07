import { DBComponent } from "../../../../../../core/component";

export default class ASTLiterals {
    
    public static null = {
        id: -1,
        name: "ast-null",
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
                    lines: ["Null"],
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

    public static int =  {
        id: -1,
        name: "ast-int",
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
                    lines: ["Int"],
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

    public static float = {
        id: -1,
        name: "ast-float",
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
                    lines: ["Float"],
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

    public static string = {
        id: -1,
        name: "ast-string",
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
                    lines: ["String"],
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
        name: "ast-array",
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
                    lines: ["Array[ ]"],
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
        name: "ast-hash",
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
                    lines: ["Hash{ }"],
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

    public static function = {
        id: -1,
        name: "ast-function",
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
                    lines: ["fn() { }"],
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


}