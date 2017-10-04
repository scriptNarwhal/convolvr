/* structure actions */
import axios from 'axios';
import { browserHistory } from 'react-router'
import {
    USER_ADD,
    USER_CONNECT,
    USER_DISCONNECT,
    USERS_FETCH,
    USERS_FETCH_DONE,
    USERS_FETCH_FAIL,
    UPDATE_USER_FETCH,
    UPDATE_USER_DONE,
    UPDATE_USER_FAIL,
    DELETE_USER,
    LOGIN_FETCH,
    LOGIN_DONE,
    LOGIN_FAIL
} from '../constants/action-types';
import { API_SERVER } from '../../config.js'
import { fetchUserWorlds } from './world-actions'
export function addUser () {
    return {
        type: USER_ADD
    }
}
export function userConnect (id) {
    return {
        type: USER_CONNECT,
        id: id
    }
}
export function userDisconnect (id) {
    return {
        type: USER_DISCONNECT,
        id
    }
}
export function fetchUsers (id) {
    return dispatch => {
     dispatch({
         type: USERS_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/users/"+id)
        .then(response => {
            dispatch(receiveUsers(response))
        }).catch(response => {
            dispatch(failedFetchUsers(response))
        });
   }
}
export function receiveUsers (users) {
    return {
        type: USERS_FETCH_DONE,
        users: users
    }
}
export function failedFetchUsers (err) {
    return {
        type: USERS_FETCH_FAIL,
        err: err
    }
}
export function updateUser ( id, name, pass, email, data ) {

    return dispatch => {
        dispatch({
            type: UPDATE_USER_FETCH
        })
        return axios.put(API_SERVER+"/api/users", {
            id,
            name,
            password: pass,
            email,
            data
        })
        .then(response => {
            dispatch(updateUserDone(response))
         }).catch(response => {
            dispatch(updateUserFailed(response))
       });
  }

}
export function updateUserFailed ( resp ) {
    
    return {
        type: UPDATE_USER_FAIL,
        data: false,
        error: resp.error
    }
}
export function updateUserDone ( resp ) {
    
    return {
        type: UPDATE_USER_DONE,
        data: resp.data,
        id: resp.data.id
    }
}
export function deleteUser (id) {
    return {
        type: DELETE_USER
    }
}

export function login ( user, pass, email, data ) {
    return dispatch => {
         dispatch({
             type: LOGIN_FETCH
         })
         return axios.post(API_SERVER+"/api/users", {
             id: 0,
             name: user,
             password: pass,
             email: email,
             data: data
         })
         .then(response => {
             dispatch(loginDone(response))
             dispatch(fetchUserWorlds(response.data.id))
          }).catch(response => {
              dispatch(loginFailed(response))
        });
   }
}

export function loginDone (response) {
    let data = response.data,
        worldUser = three.world.user
    worldUser.name = data.name
    worldUser.email = data.email
    worldUser.id = data.id
  if (window.location.href.indexOf("/login") > -1) {
      browserHistory.push("/chat")
  }
  return {
      type: LOGIN_DONE,
      data: response.data
  }
}
export function loginFailed (response) {
    return {
        type: LOGIN_FAIL,
        data: response.data
    }
}
