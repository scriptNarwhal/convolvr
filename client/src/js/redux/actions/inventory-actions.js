import {
    INVENTORY_ADD_FETCH,
    INVENTORY_ADD_DONE,
    INVENTORY_ADD_FAIL,
    INVENTORY_FETCH,
    INVENTORY_FETCH_FAIL,
    INVENTORY_FETCH_DONE,
    INVENTORY_ITEM_FETCH,
    INVENTORY_ITEM_FETCH_FAIL,
    INVENTORY_ITEM_FETCH_DONE,
    INVENTORY_UPDATE_FETCH,
    INVENTORY_UPDATE_DONE,
    INVENTORY_UPDATE_FAIL,
    INVENTORY_DELETE_FETCH,
    INVENTORY_DELETE_DONE,
    INVENTORY_DELETE_FAIL,
    INVENTORY_ADD_TO_WORLD_FETCH,
    INVENTORY_ADD_TO_WORLD_DONE,
    INVENTORY_ADD_TO_WORLD_FAIL
  } from '../constants/action-types'
  import axios from 'axios'
  import { browserHistory } from 'react-router'
  import { API_SERVER } from '../../config.js'
  
  
  export function getInventory (userId, category) {
  
      return dispatch => {
       dispatch({
          type: INVENTORY_FETCH,
          userId
       })
       return axios.get(API_SERVER+`/api/inventory/${userId}/${category}`)
          .then(res => {
              dispatch({
                  type: INVENTORY_FETCH_DONE,
                  data: res.data,
                  category
              })
          }).catch(err => {
              dispatch({
                  type: INVENTORY_FETCH_FAIL,
                  category,
                  err: err
              })
          });
     }
  
  }
  
  export function addInventoryItem ( userId, category, data ) {
  
      return dispatch => {
       dispatch({
          type: INVENTORY_ADD_FETCH,
          data
       })
       return axios.post(API_SERVER+`/api/inventory/${userId}/${category}`, data)
          .then(response => {
              dispatch({
                    type: INVENTORY_ADD_DONE,
                    created: response.data
                })
          }).catch(response => {
                dispatch({
                    type: INVENTORY_ADD_FAIL,
                    err: response.error
                })
          });
     }
  
  }
  
  export function updateInventoryItem ( userId, category, data) {
  
      return dispatch => {
       dispatch({
          type: INVENTORY_UPDATE_FETCH,
          id: id
       })
       return axios.post(API_SERVER+`/api/inventory/${userId}/${category}`, data)
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

  
  export function removeInventoryItem ( userId, category, itemId,) {
  
      return dispatch => {
       dispatch({
          type: INVENTORY_DELETE_FETCH,
          id: id
       })
       return axios.put(API_SERVER+`/api/inventory/${userId}/${category}/${itemId}`, {})
          .then(response => {
              dispatch({
                type: INVENTORY_DELETE_DONE,
                details: response.data
            })
          }).catch(response => {
              dispatch({
                    type: INVENTORY_DELETE_FAIL,
                    err: response.error
                })
          });
     }
  
  }

  export function addItemToWorld ( userId, category, itemId, world, coords ) {
    
        return dispatch => {
         dispatch({
            type: INVENTORY_UPDATE_FETCH,
            id: id
         })
         return axios.put(API_SERVER+`/api/import-from-inventory/${userId}/${category}/${itemId}/${world}/${coords}`, {})
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