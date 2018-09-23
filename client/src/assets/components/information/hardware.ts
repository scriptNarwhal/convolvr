import  { DBComponent } from "../../../core/component";

export default class HardwareDevices {
    public static diskDrik = {
        id: -1,
        name: "disk-drive",
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
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static displayAdapter =  {
        id: -1,
        name: "display-adapter",
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
        quaternion: [ 0, 0, 0, 1 ]
    };

    public static ioController = {
        id: -1,
        name: "io-controller",
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
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static key =  {
        id: -1,
        name: "key",
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
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static keyboard = {
        attrs: {
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
    }

    public static networkInterface =  {
        id: -1,
        name: "network-interface",
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
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static screen =  {
        id: -1,
        name: "screen",
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
        quaternion: [ 0, 0, 0, 1 ]
    }

    public static serialCable = {
        id: -1,
        name: "serial-cable",
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
        quaternion: [ 0, 0, 0, 1 ]
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
        quaternion: [ 0, 0, 0, 1 ]
    }

}