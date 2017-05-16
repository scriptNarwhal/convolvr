export default class NetworkInterfaceSystem { // for use with CPUSystem GPUSystem InputSystem, etc
    
    constructor ( world ) {

        this.world = world

    }


    init ( component ) {

        return {
            address: "", // implement
            outgoing: [],
            incoming: []
        }
    }

}