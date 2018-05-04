import Component from "../../core/component";
import Convolvr from "../../world/world";
import Entity from "../../core/entity";

export default class VehicleSystem {

    private world: Convolvr

    constructor (world: Convolvr) {
        this.world = world
    }

    init (component: Component) { 
        let attr = component.attrs.seat

        return {
            enterVehicle: (entity: Entity) => {
                this.enterVehicle(component, entity)
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

