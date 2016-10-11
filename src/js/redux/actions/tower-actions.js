/* structure actions */
import {
    TOWER_ADD,
    TOWERS_FETCH,
    TOWERS_FETCH_DONE,
    TOWERS_FETCH_FAIL,
    TOWER_UPDATE,
    TOWER_DELETE
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addTower () {
    return {
        type: TOWER_ADD
    }
}
export function fetchTowers (id) {
    return dispatch => {
     dispatch({
         type: TOWERS_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/towers"+id)
        .then(response => {
            dispatch(doneFetchTowers(response))
        }).catch(response => {
            dispatch(failedFetchTowers(response))
        });
   }
}
export function doneFetchTowers (towers) {
    let physicsWorld = three.world.worldPhysics.worker;
    towers.map(data => {

    })
    return {
        type: TOWERS_FETCH_DONE,
        towers: towers
    }
}
export function failedFetchTowers (err) {
    return {
        type: TOWERS_FETCH_FAIL,
        err: err
    }
}
export function updateTower (id, data) {
    return {
        type: UPDATE_TOWER,
        data: data,
        id: id
    }
}
export function deleteTower (id) {
    let physicsWorld = three.world.worldPhysics.worker;
    physicsWorld.postMessage(JSON.stringify({
        command: "remove tower",
        data: id
    }))
    return {
        type: DELETE_TOWER
    }
}
