import {
    SEND_MESSAGE,
    FETCH_MESSAGES,
    RECEIVE_MESSAGES,
    FAILED_FETCH_MESSAGES,
    UPDATE_MESSAGE,
    DELETE_MESSAGE
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function sendMessage () {
    return {
        type: SEND_MESSAGE
    }
}
export function fetchMessages (id) {
    return dispatch => {
     dispatch({
         type: FETCH_MESSAGES,
         id: id
     })
     return axios.get(API_SERVER+"/api/messages"+id)
        .then(response => {
            dispatch(receiveMessages(response))
        }).catch(response => {
            dispatch(failedFetchMessages(response))
        });
   }
}
export function receiveMessages (messages) {
    return {
        type: RECEIVE_MESSAGES,
        messages: messages
    }
}
export function failedFetchMessages (err) {
    return {
        type: FAILED_FETCH_MESSAGES,
        err: err
    }
}
export function updateMessage (id, data) {
    return {
        type: UPDATE_MESSAGE,
        data: data,
        id: id
    }
}
export function deleteMessage (id) {
    return {
        type: DELETE_MESSAGE
    }
}
