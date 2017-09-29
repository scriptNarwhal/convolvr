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

export function sendMessage (message, from, files) {

    send('chat message', {
      message,
      from,
        files
    })

    return {
        type: MESSAGE_SEND,
    }

}

export function getMessage (message, from, files) {

    return {
        type: MESSAGE_GET,
        message,
        from,
        files
    }
    
}

export function getChatHistory (skip) {

    return dispatch => {

     dispatch({
         type: CHAT_HISTORY_FETCH,
         skip
     })

     return axios.get(API_SERVER+"/api/chat-history/"+skip)
        .then(response => {

            let chatUI = three.world.chat,
                chatUIText = null,
                newMessages = [],
                lastSender = '',
                populateVRChat = (data) => {
                    data.map((msg) =>{

                        let newMessage = JSON.parse(msg.message),
                            sender = ''
          
                        newMessages.push(newMessage)
          
                        if (chatUI) {
                            chatUIText = chatUI.componentsByProp.text[0].state.text
                            
                            if ( newMessage.from != lastSender || (newMessage.files!=null && newMessage.files.length > 0) )
                                sender = `${newMessage.from}: `
                            
          
                          lastSender = newMessage.from
                          chatUIText.write(`${sender}${newMessage.message}`)
          
                        }
          
                      })
                }

            console.warn("Chat History: ", chatUI)

            if ( chatUI ) {
                populateVRChat( response.data )
            } else {
                setTimeout(()=> { populateVRChat( response.data) }, 5000)
            }

            chatUIText.write("[ Press Enter To Chat ]")
            chatUIText.update()

            dispatch({
                type: CHAT_HISTORY_DONE,
                data: newMessages
            })

        }).catch(response => {
            dispatch({
                type: CHAT_HISTORY_FAIL,
                error: response.error
            })
        })

   }

}
