export default class MemorySystem { // for use with CPUSystem GPUSystem InputSystem, etc
    constructor ( world ) {
        this.world = world
    }

    init ( component ) {

        return {
            map: {}, // key value store
            stack: [], // current instructions
            stacks: {}, // map of arrays of instructions
            images: [], // video memory
            imagesByName: {}, 
        }
    }

}