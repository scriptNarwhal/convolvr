import { events } from '../network/socket'

export default class ChatSystem {

    constructor ( world ) {

        this.world = world
        this.componentsByUserId = { all: [] }
        this.lastSender = ""

        let byUserId = this.componentsByUserId,
            chat = this

        events.on("chat message", message => {

        let chatMessage = JSON.parse( message.data )
          
             Object.keys( byUserId ).map( userId => {

                 byUserId[ userId ].map( comp => {

                    let props = comp.props,
                        from = ''
                    
                    if ( props.chat.displayMessages ) {

                        if ( userId == "all" ) {

                        if ( chatMessage.from != chat.lastSender ) {
                            from = `${chatMessage.from}: `
                        }

                        comp.state.text.write(`${from}${chatMessage.message}`) // can batch this without re-rendering each time
                        comp.state.text.update()

                        } else if ( userId == props.chat.userId  && props.text ) {

                             comp.state.text.write(`${chatMessage.from}${chatMessage.message}`) // can batch this without re-rendering each time
                             comp.state.text.update()  

                        }

                    }

                 })

            })

        })

    }

    init ( component ) { 
        
        let prop = component.props.chat,
            userId = prop.userId || "",
            world = prop.world || ""

        prop.userId = prop.userId || "all"

        if ( this.componentsByUserId[ prop.userId ] == null ) {

            this.componentsByUserId[ prop.userId ] = []

        }
       
        if ( !this.containsObject( component, this.componentsByUserId[ prop.userId ] ) ) {

            this.componentsByUserId[ prop.userId ].push( component )

        }
        
        if ( prop.sendMessage ) {

        }

        if ( prop.enterMessage ) {

        }

        return {
            sendMessage: (message) => {
                this.sendMessage(message)
            }    
        }
    }

    sendMessage (message) {
        
    }

    containsObject ( obj, list ) {

        let  i = 0

        for ( i = list.length - 1; i >= 0; i-- ) {

            if ( list[ i ] === obj ) {
                return true
            }

        }

        return false
    }
}

