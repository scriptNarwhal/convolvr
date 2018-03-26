import Component from "../../core/component";
import Convolvr from "../../world/world";

export default class VehicleSystem {

    private world: Convolvr

    constructor (world: Convolvr) {
        this.world = world
    }

    init (component: Component) { 
        let attr = component.attrs.seat

        return {
            enterVehicle: (entity) => {
                this.enterVehicle(component, entity)
            },
            exitVehicle: (entity) => {
                this.exitVehicle(component, entity)
            }
        }
    }

    enterVehicle (component, entity) {

        let attr = component.attrs.vehicle,
            state = component.state.vehicle
            
    }
    
    exitVehicle (component, entity) {

        let attr = component.attrs.vehicle,
            state = component.state.vehicle

    }

}

