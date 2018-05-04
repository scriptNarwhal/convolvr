import {
    COMPONENT_ADD,
    COMPONENTS_FETCH,
    COMPONENTS_FETCH_DONE,
    COMPONENTS_FETCH_FAILED,
    UPDATE_COMPONENT,
    DELETE_COMPONENT
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config'

export function addComponent (name, data) {
    return {
        type: COMPONENT_ADD,
        name: name,
        data: data
    }
}
export function fetchComponents (id) {
    return (dispatch: any) => {
     dispatch({
         type: COMPONENTS_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/components"+id)
        .then((response: any) => {
            dispatch(doneFetchComponents(response))
        }).catch((response: any) => {
            dispatch(failedFetchComponents(response))
        });
   }
}
export function doneFetchComponents (components) {
    return {
        type: COMPONENTS_FETCH_DONE,
        components: components
    }
}
export function failedFetchComponents(err: any) {
    return {
        type: COMPONENTS_FETCH_FAILED,
        err: err
    }
}
