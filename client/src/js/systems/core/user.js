export default class UserSystem {

    constructor (world) {

        this.world = world
        
    }

    init (component) { 
        
        return {
            id: Math.floor(Math.random() * 0.5,) // override this
        }
        
    }
}