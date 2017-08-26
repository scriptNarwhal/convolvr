export default class VehicleSystem {

    constructor (world) {
        this.world = world
    }

    init (component) { 
        let prop = component.props.seat

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

        let prop = component.props.vehicle,
            state = component.state.vehicle
            
    }
    
    exitVehicle (component, entity) {

        let prop = component.props.vehicle,
            state = component.state.vehicle

    }

}

