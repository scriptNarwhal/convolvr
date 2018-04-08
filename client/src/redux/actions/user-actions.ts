/* structure actions */
import axios from 'axios';
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
    USER_LOG_OUT,
    DELETE_USER,
    LOGIN_FETCH,
    LOGIN_DONE,
    LOGIN_FAIL
} from '../constants/action-types';
import { API_SERVER } from '../../config.js'
import { fetchUserSpaces } from './world-actions'
export function addUser () {
    return {
        type: USER_ADD
    }
}
export function userConnect (id: any) {
    return {
        type: USER_CONNECT,
        id: id
    }
}
export function userDisconnect (id: any) {
    return {
        type: USER_DISCONNECT,
        id
    }
}
export function logOut () {
    localStorage.removeItem("username")
    localStorage.removeItem("password")
    return {
        type: USER_LOG_OUT
    }
}
export function fetchUsers (id: any) {
    return (dispatch: any) => {
     dispatch({
         type: USERS_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/users/"+id)
        .then((response: any) => {
            dispatch(receiveUsers(response))
        }).catch((response: any) => {
            dispatch(failedFetchUsers(response))
        });
   }
}
export function receiveUsers (users: any[]) {
    return {
        type: USERS_FETCH_DONE,
        users: users
    }
}
export function failedFetchUsers(err: any) {
    return {
        type: USERS_FETCH_FAIL,
        err: err
    }
}
export function updateUser ( id: any, name: string, pass: string, email: string, data: any) {

    return (dispatch: any) => {
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
        .then((response: any) => {
            dispatch(updateUserDone(response))
         }).catch((response: any) => {
            dispatch(updateUserFailed(response))
       });
  }

}
export function updateUserFailed ( resp: any ) {
    
    return {
        type: UPDATE_USER_FAIL,
        data: false,
        error: resp.error
    }
}
export function updateUserDone ( resp: any ) {
    
    return {
        type: UPDATE_USER_DONE,
        data: resp.data,
        id: resp.data.id
    }
}
export function deleteUser (id: any) {
    return {
        type: DELETE_USER
    }
}

export function login ( user: string, pass: string, email: string, data: any ) {
    return (dispatch: any) => {
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
         .then((response: any) => {
             console.info("ACTION LOGIN: USER USER LOGIN ", (window as any).three.world.onUserLogin);
             (window as any).three.world.onUserLogin( response )
             dispatch(loginDone(response))
             dispatch(fetchUserSpaces(response.data.id))
             
          }).catch((response: any) => {
              dispatch(loginFailed(response))
        });
   }
}

export function loginDone ( response: any ) {
    
    setTimeout(()=>{
        let data = response.data,
        worldUser = (window as any).three.world.user

        worldUser.name = data.name
        worldUser.email = data.email
        worldUser.id = data.id
        console.info("USER DATA: ", worldUser.data)
        worldUser.data = Object.assign({}, worldUser.data, data.data )
    }, 1000)
    

  if (window.location.href.indexOf("/login") > -1) {
        console.warn("call redirect here .. make redux action for it")
        //browserHistory.push("/chat")
  }
  return {
      type: LOGIN_DONE,
      data: response.data
  }
}
export function loginFailed (response: any) {
    return {
        type: LOGIN_FAIL,
        data: response.data
    }
}
