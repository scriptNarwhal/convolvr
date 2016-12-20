import {
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
  WORLD_DELETE_FAIL
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function fetchWorlds () {
    return dispatch => {
     dispatch({
        type: WORLDS_FETCH
     })
     return axios.get(API_SERVER+"/api/worlds")
        .then(response => {
            dispatch(doneFetchWorlds(response))
        }).catch(response => {
            dispatch(failedFetchWorlds(response))
        });
   }
}
export function doneFetchWorlds (res) {
    return {
        type: WORLDS_FETCH_DONE,
        worlds: res.data
    }
}
export function failedFetchWorlds (err) {
    return {
        type: WORLDS_FETCH_FAIL,
        err: err
    }
}

export function createWorld (data) {
    return dispatch => {
     dispatch({
        type: WORLDS_FETCH,
        data
     })
     return axios.post(API_SERVER+"/api/worlds")
        .then(response => {
            dispatch(createWorldDone(response))
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

export function updateWorld (id, data) {
    return dispatch => {
     dispatch({
        type: WORLD_UPDATE_FETCH,
        id: id
     })
     return axios.post(API_SERVER+"/api/worlds/"+id)
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
