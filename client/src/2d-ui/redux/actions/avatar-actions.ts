import {
    ADD_AVATAR,
    FETCH_AVATARS,
    RECEIVE_AVATARS,
    FAILED_FETCH_AVATARS,
    UPDATE_AVATAR,
    DELETE_AVATAR
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../../config'

export function addAvatar (data: {[_:string]: any}) {
    return {
        type: ADD_AVATAR,
        data: data
    }
}
export function fetchAvatars (id: any) {
    return (dispatch: any) => {
        dispatch({
            type: FETCH_AVATARS,
            id: id
        })
     return axios.get(API_SERVER+"/api/avatars"+id)
        .then((response: any) => {
            dispatch(receiveAvatars(response))
        }).catch((response: any) => {
            dispatch(failedFetchAvatars(response))
        });
   }
}
export function receiveAvatars (avatars: any[]) {
    return {
        type: RECEIVE_AVATARS,
        avatars: avatars
    }
}
export function failedFetchAvatars(err: any) {
    return {
        type: FAILED_FETCH_AVATARS,
        err: err
    }
}
export function updateAvatar (id: any, data: {[_:string]: any}) {
    return {
        type: UPDATE_AVATAR,
        data: data,
        id: id
    }
}
export function deleteAvatar (id: any) {
    return {
        type: DELETE_AVATAR
    }
}
