import {
    MESSAGE_SEND,
    MESSAGE_GET,
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'
import { send } from '../../network/socket.js'

export function sendMessage (message, from) {
    send('chat message', {
      message,
      from
    })
    return {
        type: MESSAGE_SEND,
    }
}

export function getMessage (message, from) {
    return {
        type: MESSAGE_GET,
        message,
        from
    }
}
