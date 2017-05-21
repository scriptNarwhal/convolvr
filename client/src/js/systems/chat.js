export default class ChatSystem {
    constructor (world) {
        this.world = world
    }

    init (component) { 
        
        let prop = component.props.chat,
            userId = prop.userId || "",
            world = prop.world || ""

        if ( prop.sendMessage ) {

        }

        if ( prop.enterMessage ) {

        }

        if ( prop.lastMessage ) {

            // check prop.lastMessage

        }

        if ( prop.allMessages ) {

            // subscribe to / render all messages for world

        }


        return {
            sendMessage: (message) => {
                this.sendMessage(message)
            }    
        }
    }

    sendMessage (message) {
        
    }
}

