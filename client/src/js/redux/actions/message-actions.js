import {
    MESSAGE_SEND,
    MESSAGE_GET,
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'
import { send } from '../../network/socket.js'

export function sendMessage (message) {
    console.log("send")
    send("chat message", message)
    return {
        type: MESSAGE_SEND
    }
}

export function getMessage (message) {
    return {
        type: MESSAGE_GET,
        message
    }
}
