import {
    MESSAGE_SEND,
    MESSAGE_GET,
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function sendMessage () {
    return {
        type: MESSAGE_SEND
    }
}

export function getMessage (id) {
    return {
        type: MESSAGE_GET
    }
}
