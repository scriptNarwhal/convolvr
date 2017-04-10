import {
  NETWORK_DOMAIN_LIST,
  NETWORK_DOMAIN_LIST_DONE,
  NETWORK_DOMAIN_LIST_FAIL
} from '../constants/action-types'
import axios from 'axios'
import { API_SERVER } from '../../config.js'

export function fetchDomains () {
    return dispatch => {
     dispatch({
        type: NETWORK_DOMAIN_LIST
     })
     return axios.get(API_SERVER+"/api/worlds")
        .then(response => {
            dispatch(doneFetchDomains(response))
        }).catch(response => {
            dispatch(failedFetchDomains(response))
        });
   }
}

export function doneFetchDomains (res) {
    return {
        type: NETWORK_DOMAIN_LIST_DONE,
        data: res.data
    }
}
export function failedFetchDomains (err) {
    return {
        type: NETWORK_DOMAIN_LIST_FAIL,
        err: err
    }
}