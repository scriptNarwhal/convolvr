import Component from "../../model/component";
import Convolvr from "../../world/world";
import Entity from "../../model/entity";
import { vehicle, control } from "../../model/attribute";

export default class VehicleSystem {

    private world: Convolvr

    constructor (world: Convolvr) {
        this.world = world
    }

    init (component: Component) { 
        let attr: vehicle = component.attrs.vehicle,
            control: control = component.attrs.control;

        return {
            enterVehicle: (entity: Entity) => {
                if (attr.onActivate) {
                    if (attr.onActivate.driverSeat) {
                        // 
                        this.enterVehicle(component, entity)       
                    }
                }
            },
            exitVehicle: (entity: Entity) => {
                this.exitVehicle(component, entity)
            }
        }
    }

    enterVehicle (component: Component, entity: Entity) {
        let attr = component.attrs.vehicle,
            state = component.state.vehicle
            
    }
    
    exitVehicle (component: Component, entity: Entity) {
        let attr = component.attrs.vehicle,
            state = component.state.vehicle

    }

}

