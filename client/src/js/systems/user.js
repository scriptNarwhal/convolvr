export default class UserSystem {

    constructor (world) {

        this.world = world
        
    }

    init (component) { 
        
        return {
            id: Math.floor(Math.random() * 10000) // override this
        }
        
    }
}