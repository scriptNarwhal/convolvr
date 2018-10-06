import { DBComponent } from "../../../../../../core/component";
import { DBEntity } from "../../../../../../core/entity";

export default class ASTExpressions {
    public static PrefixExpression =  {
        id: -1,
        name: "ast-PrefixExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
                    name: "metal"
                },
                text: {
                    lines: [],
                    color:"#2020ff",
                    background: "#000000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ]
    } as DBEntity;

    public static InfixExpression =  {
        id: -1,
        name: "ast-InfixExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static IfExpression =  {
        id: -1,
        name: "ast-IfExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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
    public static ForExpression =  {
        id: -1,
        name: "ast-ForExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static WhileExpression =  {
        id: -1,
        name: "ast-WhileExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static SleepExpression =  {
        id: -1,
        name: "ast-SleepExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static CallExpression =  {
        id: -1,
        name: "ast-CallExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static NewExpression =  {
        id: -1,
        name: "ast-NewExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static ExecExpression =  {
        id: -1,
        name: "ast-ExecExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static IndexExpression =  {
        id: -1,
        name: "ast-IndexExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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

    public static IndexAssignmentExpression =  {
        id: -1,
        name: "ast-IndexAssignmentExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 4, 2 ]
                },
                material: {
                    color: 0x2020ff,
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
}