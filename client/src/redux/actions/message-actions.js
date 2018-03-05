import {
    MESSAGE_SEND,
    MESSAGE_GET,
    CHAT_HISTORY_FETCH,
    CHAT_HISTORY_DONE,
    CHAT_HISTORY_FAIL
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'
import { send } from '../../network/socket.js'

export function sendMessage (message, from, files, avatar, space) {

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

export function getMessage (message, from, files, avatar, space) {

    return {
        type: MESSAGE_GET,
        message,
        from,
        files,
        avatar,
        space
    }
    
}

export function getChatHistory (spaceName, skip) {
    console.warn("getChatHistory", spaceName)
    return dispatch => {

     dispatch({
         type: CHAT_HISTORY_FETCH,
         skip
     })

     return axios.get(`${API_SERVER}/api/chat-history/${spaceName}/${skip}`)
        .then(response => {

            let chatUI = three.world.chat,
                newMessages = [],
                lastSender = '',
                populateVRChat = data => {

                    let chatUIText = null
                    console.warn("Chat History: ", chatUI)
                    if ( chatUI ) {

                        chatUIText = chatUI.componentsByAttr.text[0].state.text
                        data.map( msg =>{

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

        }).catch( response => {
            dispatch({
                type: CHAT_HISTORY_FAIL,
                error: response.error
            })
        })

   }

}
