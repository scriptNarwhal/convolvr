
import Component from '../../core/component.js';
import Convolvr from '../../world/world'

export default class VirtualMachine {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) {
        let hardware = this.detectHardware(component);

        return {
            hardware,
            getDevices: () => {
                return this.getVirtualDevices(component)
            },
            addDevice: (id: string, device: any) => {
                return this.addVirtualDevice(component, id, device)
            },
            removeDevice : (id: string) => {
                return this.removeVirtualDevice(component, id)
            }
        }

    }

    private detectHardware(component: Component) {
        /**
         * Hardware detection
         * 
         * io-controller
         * display-adapter
         * keyboard
         * network-interface
         */
    }

    private getVirtualDevices (component: Component) {
       
    }
    
    private addVirtualDevice (component: Component, id: string, data: any) {
       
    }

    private removeVirtualDevice(component: Component, id: string) {

    }

}