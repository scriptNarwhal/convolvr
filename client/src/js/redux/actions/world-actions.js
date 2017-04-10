import {
  WORLD_SET_CURRENT,
  WORLD_CREATE_FETCH,
  WORLD_CREATE_DONE,
  WORLD_CREATE_FAIL,
  WORLDS_FETCH,
  WORLDS_FETCH_DONE,
  WORLDS_FETCH_FAIL,
  WORLD_UPDATE_FETCH,
  WORLD_UPDATE_DONE,
  WORLD_UPDATE_FAIL,
  WORLD_DELETE_FETCH,
  WORLD_DELETE_DONE,
  WORLD_DELETE_FAIL,
  UNIVERSE_SETTINGS_FETCH,
  UNIVERSE_SETTINGS_FETCH_DONE,
  UNIVERSE_SETTINGS_FETCH_FAIL,
  UNIVERSE_SETTINGS_UPDATE_FETCH,
  UNIVERSE_SETTINGS_UPDATE_DONE,
  UNIVERSE_SETTINGS_UPDATE_FAIL
} from '../constants/action-types'
import axios from 'axios'
import { browserHistory } from 'react-router'
import { API_SERVER } from '../../config.js'

export function fetchWorlds () {
    return dispatch => {
     dispatch({
        type: WORLDS_FETCH
     })
     return axios.get(API_SERVER+"/api/worlds")
        .then(res => {
            dispatch({
                type: WORLDS_FETCH_DONE,
                worlds: res.data
            })
        }).catch(res => {
            dispatch({
                type: WORLDS_FETCH_FAIL,
                err: err
            })
        });
   }
}
export function fetcUserhWorlds (userId) {
    return dispatch => {
     dispatch({
        type: USER_WORLDS_FETCH,
        userId
     })
     return axios.get(API_SERVER+"/api/worlds")
        .then(res => {
            dispatch({
                type: USER_WORLDS_FETCH_DONE,
                worlds: res.data
            })
        }).catch(res => {
            dispatch({
                type: USER_WORLDS_FETCH_FAIL,
                err: err
            })
        });
   }
}
export function fetchUniverseSettings () {
    return dispatch => {
     dispatch({
        type: UNIVERSE_SETTINGS_FETCH
     })
     return axios.get(API_SERVER+"/api/universe-settings")
        .then(response => {
            if (window.location.href.indexOf("/world/") == -1) {
              dispatch({
                type: WORLD_SET_CURRENT,
                current: response.data.defaultWorld
              })
            }

            dispatch({
              type: UNIVERSE_SETTINGS_FETCH_DONE,
              settings: response.data
            })
        }).catch(response => {
            dispatch({
              type: UNIVERSE_SETTINGS_FETCH_FAIL,
              err: response
            })
        });
   }
}

export function createWorld (data) {
    return dispatch => {
     dispatch({
        type: WORLDS_FETCH,
        data
     })
     return axios.post(API_SERVER+"/api/worlds", data)
        .then(response => {
            dispatch(createWorldDone(response))
            browserHistory.push("/world/"+data.name)
            window.location.href = window.location.href  /* work around */
        }).catch(response => {
            dispatch(createWorldFail(response))
        });
   }
}
export function createWorldDone (res) {
    return {
        type: WORLD_CREATE_DONE,
        created: res.data
    }
}
export function createWorldFail (err) {
    return {
        type: WORLD_CREATE_FAIL,
        err
    }
}
export function setCurrentWorld (world) {
  return {
    type: WORLD_SET_CURRENT,
    current: world
  }
}
export function updateWorld (id, data) {
    return dispatch => {
     dispatch({
        type: WORLD_UPDATE_FETCH,
        id: id
     })
     return axios.post(API_SERVER+"/api/worlds/"+id, data)
        .then(response => {
            dispatch(updateWorldDone(response))
        }).catch(response => {
            dispatch(updateWorldFail(response))
        });
   }
}
export function updateWorldDone (res) {
    return {
        type: WORLD_UPDATE_DONE,
        updated: res.data
    }
}
export function updateWorldFail (err) {
    return {
        type: WORLD_UPDATE_FAIL,
        err
    }
}
export function updateUniverseSettings (data, password) {
    return dispatch => {
     dispatch({
        type: UNIVERSE_SETTINGS_UPDATE_FETCH,
        id: 1
     })
     return axios.post(API_SERVER+"/api/universe-settings", data)
        .then(response => {
            dispatch({
                type: UNIVERSE_SETTINGS_UPDATE_DONE,
                settings: res.data
            })
        }).catch(response => {
            dispatch({
                type: UNIVERSE_SETTINGS_UPDATE_FAIL,
                err: res.error
            })
        });
   }
}

export function deleteWorld (id, data) {
    return dispatch => {
     dispatch({
        type: WORLD_DELETE_FETCH,
        id: id
     })
     return axios.post(API_SERVER+"/api/worlds/delete/"+id)
        .then(response => {
            dispatch(deleteWorldDone(response))
        }).catch(response => {
            dispatch(deleteWorldFail(response))
        });
   }
}
export function deleteWorldDone (res) {
    return {
        type: WORLD_DELETE_DONE,
        details: res.data
    }
}
export function deleteWorldFail (err) {
    return {
        type: WORLD_DELETE_FAIL,
        err
    }
}
