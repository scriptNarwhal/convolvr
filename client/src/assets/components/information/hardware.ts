import  { DBComponent } from "../../../core/component";

export default class HardwareDevices {
    
    public static cpu = {
        id: -1,
        name: "cpu",
        components: [{
            attrs: {
                virtualMachine: {
                    program: [
                        'print("hello machine! =)")'
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    }

    public static ioController = {
        id: -1,
        name: "io-controller",
        components: [{
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    }
    
    public static networkInterface =  {
        id: -1,
        name: "network-interface",
        components: [{
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    }

    public static displayAdapter =  {
        id: -1,
        name: "display-adapter",
        components: [{
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    };

    public static key =  {
        id: -1,
        name: "key",
        components: [{
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
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
        components: [{
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    }

    public static display =  {
        id: -1,
        name: "display",
        components: [{
            attrs: {
                virtualDevice: {
                    type: "display"
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    }

    public static serialCable = {
        id: -1,
        name: "serial-cable",
        components: [{
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    }

    public static terminalCase = {
        id: -1,
        name: "terminal-case",
        components: [{
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
        }],
        position: [ 0, 0, 0 ],
        quaternion: [ 0, 0, 0, 1 ],
        tags: ["information-hardware"]
    }

}