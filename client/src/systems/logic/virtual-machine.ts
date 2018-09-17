
import Component from '../../core/component.js';
import Convolvr from '../../world/world'

export default class VirtualMachine {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) {

        this.detectHardware(component);

        return {
            getVirtualDevices: () => {
                return this.getVirtualDevices(component)
            },
            addVirtualDevice: (id: string, device: any) => {
                return this.addVirtualDevice(component, id, device)
            },
            removeVirtualDevice : (id: string) => {
                return this.removeVirtualDevice(component, id)
            }
        }

    }

    private detectHardware(component: Component) {

    }

    private getVirtualDevices (component: Component) {
       
    }
    
    private addVirtualDevice (component: Component, id: string, data: any) {
       
    }

    private removeVirtualDevice(component: Component, id: string) {

    }

}