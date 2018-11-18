import  { DBComponent } from "../../../model/component";

export default class HardwareDevices {
    
    public static cpu = {
        id: -1,
        name: "cpu",
            attrs: {
                virtualMachine: {
                    program: [
                        'let foo = 1234',
                        'print(foo + 5)'
                    ]
                },
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }

    public static ioController = {
        id: -1,
        name: "io-controller",
            attrs: {
                virtualDevice: {
                    type: "io-controller"
                },
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }
    
    public static networkInterface =  {
        id: -1,
        name: "network-interface",
        attrs: {
                virtualDevice: {
                    type: "network-interface"
                },
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }

    public static displayAdapter =  {
        id: -1,
        name: "display-adapter",
            attrs: {
                virtualDevice: {
                    type: "display-adapter"
                },
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    };

    public static key =  {
        id: -1,
        name: "key",
            attrs: {
                /* tool ??? */
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }

    public static keyboard = {
        attrs: {
            virtualDevice: {
                type: "keyboard"
            },
            geometry: {
                shape: "box",
                size: [ 2, 2, 2 ]
            },
            material: {
                color: 0xffffff,
                name: "metal"
            },
            layout: {
                type: "grid",
                mode: "factory",
                columns: 6,
                axis: "xz"
            }
        },
        quaternion: [ 0, 0, 0, 1 ],
        position: [ 0, 0, 0 ],
        components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }

    public static diskDrive = {
        id: -1,
        name: "disk-drive",
            attrs: {
                virtualDevice: {
                    type: "disk-drive"
                },
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }

    public static display =  {
        id: -1,
        name: "display",
            attrs: {
                virtualDevice: {
                    type: "display"
                },
                text: {
                    lines: [
                        ""
                    ],
                    color: "#fff",
                    background: "#000"
                },
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    } as DBComponent

    public static serialCable = {
        id: -1,
        name: "serial-cable",
            attrs: {
                virtualDevice: {
                    type: "serial-cable"
                },
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }

    public static terminalCase = {
        id: -1,
        name: "terminal-case",
            attrs: {
                geometry: {
                    shape: "box",
                    size: [ 2, 2, 2 ]
                },
                material: {
                    color: 0xffffff,
                    name: "metal"
                }
            },
            quaternion: [ 0, 0, 0, 1 ],
            position: [ 0, 0, 0 ],
            components: ([] as DBComponent[]),
        tags: ["information-hardware"]
    }

}