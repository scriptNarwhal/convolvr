/* structure actions */
import {
    STRUCTURE_ADD,
    STRUCTURES_FETCH,
    STRUCTURES_FETCH_DONE,
    STRUCTURES_FETCH_FAIL,
    STRUCTURE_UPDATE,
    STRUCTURE_DELETE
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addTower () {
    return {
        type: STRUCTURE_ADD
    }
}
export function fetchTowers (id) {
    return dispatch => {
     dispatch({
         type: STRUCTURES_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/structures"+id)
        .then(response => {
            dispatch(doneFetchTowers(response))
        }).catch(response => {
            dispatch(failedFetchTowers(response))
        });
   }
}
export function doneFetchTowers (structures) {
    let physicsWorld = three.world.UserPhysics.worker;
    structures.map(data => {

    })
    return {
        type: STRUCTURES_FETCH_DONE,
        structures: structures
    }
}
export function failedFetchTowers (err) {
    return {
        type: STRUCTURES_FETCH_FAIL,
        err: err
    }
}
export function updateTower (id, data) {
    return {
        type: UPDATE_STRUCTURE,
        data: data,
        id: id
    }
}
export function deleteTower (id) {
    let physicsWorld = three.world.UserPhysics.worker;
    physicsWorld.postMessage(JSON.stringify({
        command: "remove structure",
        data: id
    }))
    return {
        type: DELETE_STRUCTURE
    }
}
