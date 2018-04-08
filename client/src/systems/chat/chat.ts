import { events } from '../../network/socket'
import Convolvr from '../../world/world';
import Entity from '../../core/entity';
import {
    getChatHistory,
    sendMessage
  } from '../../redux/actions/message-actions'
import Component from '../../core/component';

export default class ChatSystem {

    world: Convolvr
    componentsByUserId: any
    componentsByUserName: any
    lastSender: string
    chatModal: Entity

    constructor (world: Convolvr) {
        this.world = world;
        this.componentsByUserId = { all: [] };
        this.componentsByUserName = { all: [] };
        this.lastSender = "";

        let byUserName = this.componentsByUserName,
            currentUser = this.world.user.name,
            chat = this

        events.on("chat message", message => {
            let chatMessage = JSON.parse( message.data )
          
             Object.keys( byUserName ).map(userName => {

                 byUserName[userName].map((comp: Component) => {
                    let attrs = comp.attrs,
                        from = '';
                    
                    if ( attrs.chat.displayMessages ) {
                        console.log("display messages")
                        console.log(attrs.chat)
                        if ( userName == "all" ) {
                            if ( chatMessage.from != chat.lastSender ) {
                                from = `${chatMessage.from}: `
                            }
                            comp.state.text.write(`${from}${chatMessage.message}`) // can batch this without re-rendering each time
                            comp.state.text.update()
                        } else if ( userName == attrs.chat.userName && attrs.text ) {
                             comp.state.text.write(`${chatMessage.from}${chatMessage.message}`) // can batch this without re-rendering each time
                             comp.state.text.update()  
                        }
                    }
                 })
            })
        })
    }

    allSystemsLoaded () {
         // init chat modal for current user
         setTimeout( ()=>{
            
            this.initChatModal()
         }, 1700)
    }

    init(component: Component) { 
        let attr = component.attrs.chat,
            userName = attr.userName || "",
            world = attr.world || "";
        console.log("init chat component, userName", attr.userName)
        attr.userName = attr.userName || "all"

        if ( this.componentsByUserName[ attr.userName ] == null ) {
            this.componentsByUserName[ attr.userName ] = []
        }
       
        if ( !this.containsObject( component, this.componentsByUserName[ attr.userName ] ) ) {
            this.componentsByUserName[ attr.userName ].push( component )
        }
        
        if ( attr.sendMessage ) {

        }

        if ( attr.enterMessage ) {

        }

        return {
            username: attr.userName,
            space: this.world.name,
            sendMessage: (message: string) => {
                this.sendMessage(component, message)
            },
            hide: (delay = 0) => {
                setTimeout(()=>{
                    this._hide(component)
                }, delay)
            },
            show: () => {
                this._show(component)
            },

        }
    }

    _hide (component: Component) {

    }

    _show (component: Component) {

    }

    initChatModal() {
        let chatModal = this.world.systems.assets.makeEntity("help-screen", true, {}, [0,1,0]),
            cPos = this.world.three.camera.position;

        chatModal.components[0].attrs.text.lines = ["Welcome"]
        chatModal.init(this.world.three.scene, false, ()=>{})
        chatModal.update(cPos.x, cPos.y - 1, cPos.z - 1.7)
        this.chatModal = chatModal
    }

    updateChatModal() {
        let user = this.world.user.avatar,
            userPos: any = user.mesh.position;
        
        this.chatModal && this.chatModal.update( [userPos.x, userPos.y-1, userPos.z-1.2] )
    }

    hideChatModal () {
        this.chatModal.mesh.visible = false
    }

    showChatModal () {
        this.chatModal.mesh.visible = true
    }

    sendMessage (component: Component, message: string) {
        let state = component.state.chat;

        this.world.store.dispatch(sendMessage(message, state.username, [], null, state.space))
    }

    containsObject ( obj: any, list: any ): boolean {
       if (list.length == 0) {
           return false;
       }
       for ( let i = list.length - 1; i >= 0; i-- ) {
            if ( list[ i ] === obj ) {
                return true
            }
        }
        return false
    }
}

