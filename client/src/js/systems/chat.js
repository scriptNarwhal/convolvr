export default class ChatSystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        
        return {
            sendMessage: (message) => {
                this.sendMessage(message)
            }    
        }
    }

    sendMessage (message) {
        
    }
}

