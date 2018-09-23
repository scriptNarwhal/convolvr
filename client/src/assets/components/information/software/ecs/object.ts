import { DBComponent } from "../../../../../core/component";

export default class ECSObjects {

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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    };

    public static int = {
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static string =  {
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
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
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    }
}