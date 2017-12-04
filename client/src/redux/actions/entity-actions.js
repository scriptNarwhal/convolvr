import {
    ENTITY_ADD,
    ENTITIES_FETCH,
    ENTITIES_FETCH_DONE,
    ENTITIES_FETCH_FAILED,
    UPDATE_ENTITY,
    DELETE_ENTITY,
    ENTITY_IMPORT_TO_WORLD_FETCH,
    ENTITY_IMPORT_TO_WORLD_DONE,
    ENTITY_IMPORT_TO_WORLD_FAIL
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addEntity (id, name, components) {
    let physicsWorld = three.world.UserPhysics.worker; // until I can find a better way to access this

    return {
        type: ENTITY_ADD,
        id: id,
        name: name,
        components: components
    }
}
export function fetchEntities (id) {
    return dispatch => {
     dispatch({
         type: ENTITIES_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/entities"+id)
        .then(response => {
            dispatch(doneFetchEntities(response))
        }).catch(response => {
            dispatch(failedFetchEntities(response))
        });
   }
}
export function doneFetchEntities (entities) {
    return {
        type: ENTITIES_FETCH_DONE,
        entities: entities
    }
}
export function failedFetchEntities (err) {
    return {
        type: ENTITIES_FETCH_FAILED,
        err: err
    }
}

export function importEntityToWorld ( world, coords, data ) {
    
        return dispatch => {
         dispatch({
            type: INVENTORY_UPDATE_FETCH,
            id: id
         })
         return axios.put(API_SERVER+`/api/import-to-world/${userId}/${category}/${itemId}/${world}/${coords}`, {})
            .then(response => {
                dispatch({
                  type: INVENTORY_UPDATE_DONE,
                  updated: response.data
              })
            }).catch(response => {
                dispatch({
                      type: INVENTORY_UPDATE_FAIL,
                      err: response.err
                  })
            });
       }
    
    }