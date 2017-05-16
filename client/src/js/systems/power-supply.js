export default class PowerSupplySystem { // for use with CPUSystem GPUSystem InputSystem, etc
    
    constructor ( world ) { // the idea being to require more of these to allow more calculations.. and create a game out of not having the world slow down
        // although these could also be used for vehicles.. to power lights, etc
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