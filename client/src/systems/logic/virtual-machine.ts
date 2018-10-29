
import Component from '../../core/component.js';
import Convolvr from '../../world/world'
import { virtualMachine } from '../../core/attribute.js';
import { SystemDependency, System } from '../index.js';
import ScriptSystem from './script.js';

export default class VirtualMachine implements System {
    world: Convolvr
    dependencies: SystemDependency[] = [["script"]]
    private script: ScriptSystem

    constructor(world: Convolvr) {
        this.world = world
    }

    init(component: Component) {
        let hardware = this.detectHardware(component);
        console.log("Power on self test");
        const attr: virtualMachine = component.attrs.virtualMachine;

        if (attr.os) {

        }

        if (attr.program) {
            this.script.evaluateForComponent(component, attr.program.join(";"));
        }

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