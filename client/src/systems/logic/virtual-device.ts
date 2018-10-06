import Convolvr from '../../world/world'
import Component from '../../core/component'
import DisplayAdapterDevice from './virtual-devices/display-adapter'
import IOControllerDevice from './virtual-devices/io-controller'
import Keyboard from './virtual-devices/keyboard'
import NetworkInterfaces from './virtual-devices/network-interface'
import StorageDevice from './virtual-devices/storage'
import PointingDevice from './virtual-devices/pointing-device'
export interface VirtualDevice {

}

export default class VirtualDeviceSystem {
    
    world: Convolvr
    devices: {[deviceName: string]: VirtualDevice }

    constructor ( world: Convolvr ) {
        this.world = world
        this.devices = {
            "display-adapter": new DisplayAdapterDevice(world),
            "io-controller": new IOControllerDevice(world),
            "keyboard": new Keyboard(world),
            "network-interface": new NetworkInterfaces(world),
            "pointing-device": new PointingDevice(world),
            "storage": new StorageDevice(world)
            
        }
    }

    init ( component: Component ) {
        // create a canvas, save the context, etc
        // implement
       

        return {
      
        }

    }
    
    configure ( data: Object ) {

        // implement 

    }

   
}