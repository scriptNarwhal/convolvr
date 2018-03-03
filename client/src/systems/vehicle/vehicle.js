export default class VehicleSystem {

    constructor (world) {
        this.world = world
    }

    init (component) { 
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

