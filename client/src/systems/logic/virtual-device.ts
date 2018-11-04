import Component from '../../core/component'
import DisplayAdapterDevice from './virtual-devices/display-adapter'
import IOControllerDevice from './virtual-devices/io-controller'
import Keyboard from './virtual-devices/keyboard'
import NetworkInterfaces from './virtual-devices/network-interface'
import StorageDevice from './virtual-devices/storage'
import PointingDevice from './virtual-devices/pointing-device'
import DisplaySystem from '../video/display';
import { AnyObject } from '../../util';
import { System } from '..';
import Convolvr from '../../world/world';
export interface VirtualDevice {
    world: Convolvr
    init: (data: AnyObject) => AnyObject
}

export default class VirtualDeviceSystem implements System {
    
    world: Convolvr
    devices: {[deviceName: string]: VirtualDevice }

    constructor ( world: Convolvr ) {
        this.world = world
        this.devices = {
            "display": new DisplaySystem(world),
            "display-adapter": new DisplayAdapterDevice(world),
            "io-controller": new IOControllerDevice(world),
            "keyboard": new Keyboard(world),
            "network-interface": new NetworkInterfaces(world),
            "pointing-device": new PointingDevice(world),
            "storage": new StorageDevice(world)
        }
    }

    postInject() {
        this.world.systems.injectSubSystemDependencies(this.devices);
    }    

    init ( component: Component ) {
        let attr = component.attrs.virtualDevice,
            type = attr.type,
            device = this.devices[type];

        if (device) {
            return device.init(attr.data)
        }

        return { error: "no such device: "+type }
    }
    
    configure ( data: Object ) {

        // implement 

    }

   
}