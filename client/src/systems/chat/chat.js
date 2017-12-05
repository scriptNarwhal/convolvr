import { events } from '../../network/socket'
import Convolvr from '../../world/world';
import Entity from '../../entity';

export default class ChatSystem {

    world: Convolvr
    componentsByUserId: Object
    lastSender: string
    chatModal: Entity

    constructor ( world: Convolvr ) {

        this.world = world
        this.componentsByUserId = { all: [] }
        this.lastSender = ""

        let byUserId = this.componentsByUserId,
            currentUser = this.world.user.name,
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

    allSystemsReady () {
         // init chat modal for current user
        this.initChatModal()
    }

    init ( component: Component ) { 
        
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

    initChatModal() {
        let chatModal = this.world.systems.assets.makeEntity("help-screen", true),
            cPos = three.camera.position
            
        chatModal.components[0].props.text.lines = ["Welcome"]
        chatModal.init(three.scene, false, ()=>{})
        chatModal.update(cPos.x, cPos.y - 1, cPos.z - 0.7)
        this.chatModal = chatModal
    }

    updateChatModal() {
        let user = this.world.user.avatar,
            userPos = user.mesh.position
        
        this.chatModal && this.chatModal.update( userPos.x, userPos.y-1, userPos.z-1.2 )
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

