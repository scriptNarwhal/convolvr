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
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["Prefix Expr <-"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    } as DBEntity;

    public static InfixExpression =  {
        id: -1,
        name: "ast-InfixExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["-> Infix Expr <-"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static IfExpression =  {
        id: -1,
        name: "ast-IfExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["if"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };
    public static ForExpression =  {
        id: -1,
        name: "ast-ForExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["for"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static WhileExpression =  {
        id: -1,
        name: "ast-WhileExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["while"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static SleepExpression =  {
        id: -1,
        name: "ast-SleepExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["sleep"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static CallExpression =  {
        id: -1,
        name: "ast-CallExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["call()"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static NewExpression =  {
        id: -1,
        name: "ast-NewExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["new"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static ExecExpression =  {
        id: -1,
        name: "ast-ExecExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["exec"],
                    color:"#2020ff",
                    background: "#000000",
                    label: true
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static IndexExpression =  {
        id: -1,
        name: "ast-IndexExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["Index[]",
                        "Expression"
                    ],
                    color:"#2020ff",
                    background: "#000000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };

    public static IndexAssignmentExpression =  {
        id: -1,
        name: "ast-IndexAssignmentExpression",
        components: [{
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 1, 1 ]
                },
                material: {
                    color: 0x9020ff,
                    name: "metal"
                },
                text: {
                    lines: ["Index[]=Assignment",
                        "Expression"
                    ],
                    color:"#2020ff",
                    background: "#000000"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        } as DBComponent],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags:["ecs-expression"]
    };
}