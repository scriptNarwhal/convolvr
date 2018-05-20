import {
    MESSAGE_SEND,
    MESSAGE_GET,
    CHAT_HISTORY_FETCH,
    CHAT_HISTORY_DONE,
    CHAT_HISTORY_FAIL
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../../config'
import { send } from '../../../network/socket'

export function sendMessage (message: string, from: string, files: any[], avatar?: string, space?: string) {
    send('chat message', {
        message,
        from,
        files,
        avatar,
        space
    })

    return {
        type: MESSAGE_SEND,
        message,
        from,
        files,
        avatar,
        space
    }
}

export function getMessage (message: string, from: string, files: any[], avatar: string, space: string) {
    return {
        type: MESSAGE_GET,
        message,
        from,
        files,
        avatar,
        space
    }
}

export function getChatHistory (spaceName: string, skip: number) {
    return (dispatch: any) => {

     dispatch({
         type: CHAT_HISTORY_FETCH,
         skip
     })

     return axios.get(`${API_SERVER}/api/chat-history/${spaceName}/${skip}`)
        .then((response: any) => {

            let chatUI = (window as any).three.world.chat,
                newMessages: any[] = [],
                lastSender = '',
                populateVRChat = (data: any) => {

                    let chatUIText: any = null;

                    if ( chatUI ) {

                        chatUIText = chatUI.componentsByAttr.text[0].state.text
                        data.map( (msg: any) =>{

                            let newMessage = JSON.parse(msg.message),
                                sender = ''
            
                            newMessages.push( newMessage )
            
                                if ( newMessage.from != lastSender || (newMessage.files!=null && newMessage.files.length > 0) )

                                    sender = `${newMessage.from}: `
                                
                            lastSender = newMessage.from
                            chatUIText.write(`${sender}${newMessage.message}`)
            
                        })

                        chatUIText.write("[ Press Enter To Chat ]")
                        chatUIText.update()

                    }
                }

            if ( chatUI ) {
                populateVRChat( response.data )
            } else {
                setTimeout(()=> { populateVRChat( response.data) }, 5000)
            }

            dispatch({
                type: CHAT_HISTORY_DONE,
                data: newMessages
            })

        }).catch( (response: any) => {
            dispatch({
                type: CHAT_HISTORY_FAIL,
                error: response.error
            })
        })

   }

}
