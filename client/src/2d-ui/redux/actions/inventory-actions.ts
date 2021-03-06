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
    INVENTORY_ADD_TO_SPACE_FETCH,
    INVENTORY_ADD_TO_SPACE_DONE,
    INVENTORY_ADD_TO_SPACE_FAIL
  } from '../constants/action-types'
  import axios from 'axios'
  import { API_SERVER } from '../../../config'
  
  
  export function getInventory (userId: any, category: string) {
  
      return (dispatch: any) => {
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

  export function getInventoryItem ( userId: any, category: string, itemId: any ) {
    
        return (dispatch: any) => {
         dispatch({
            type: INVENTORY_ITEM_FETCH,
            userId,
            category
         })
         return axios.get(API_SERVER+`/api/inventory/${userId}/${category}/${itemId}`)
            .then( res => {
                dispatch({
                    type: INVENTORY_ITEM_FETCH_DONE,
                    data: res.data,
                    category
                })
            }).catch( err => {
                dispatch({
                    type: INVENTORY_ITEM_FETCH_FAIL,
                    category,
                    err: err
                })
            });
       }
    
    }
  
  export function addInventoryItem ( userId: any, category: string, data: any ) {
  
      return (dispatch: any) => {
       dispatch({
          type: INVENTORY_ADD_FETCH,
          data,
          category
       })
       return axios.post(API_SERVER+`/api/inventory/${userId}/${category}`, data)
          .then((response: any) => {
              dispatch({
                    type: INVENTORY_ADD_DONE,
                    created: response.data
                })
          }).catch((response: any) => {
                dispatch({
                    type: INVENTORY_ADD_FAIL,
                    err: response.error
                })
          });
     }
  
  }
  
  export function updateInventoryItem ( userId: any, category: string, data: any) {
  
      return (dispatch: any) => {
       dispatch({
          type: INVENTORY_UPDATE_FETCH,
          id: userId,
          category
       })
       return axios.post(API_SERVER+`/api/inventory/${userId}/${category}`, data)
          .then((response: any) => {
              dispatch({
                type: INVENTORY_UPDATE_DONE,
                updated: response.data
            })
          }).catch((response: any) => {
              dispatch({
                    type: INVENTORY_UPDATE_FAIL,
                    err: response.err
                })
          });
     }
  
  }

  
  export function removeInventoryItem ( userId: any, category: string, itemId: any) {
  
      return (dispatch: any) => {
       dispatch({
          type: INVENTORY_DELETE_FETCH,
          id: userId,
          itemId
       })
       return axios.put(API_SERVER+`/api/inventory/${userId}/${category}/${itemId}`, {})
          .then((response: any) => {
              dispatch({
                type: INVENTORY_DELETE_DONE,
                details: response.data
            })
          }).catch((response: any) => {
              dispatch({
                    type: INVENTORY_DELETE_FAIL,
                    err: response.error
                })
          });
     }
  
  }
  
  export function addItemToSpace ( userId: any, category: string, itemId: any, world: string, coords: string, itemData: any ) {
    
        return (dispatch: any) => {
            itemData.voxel = coords.split("x").map( v=> parseInt(v) )
         dispatch({
            type: INVENTORY_ADD_TO_SPACE_FETCH,
            userId,
            category,
            itemId,
            itemData,
            world,
            coords
         })
         return axios.put(API_SERVER+`/api/import-to-world/${world}/${coords}`, itemData)
            .then((response: any) => {
                dispatch({
                  type: INVENTORY_ADD_TO_SPACE_DONE,
                  updated: response.data
              })
            }).catch((response: any) => {
                dispatch({
                      type: INVENTORY_ADD_TO_SPACE_FAIL,
                      err: response.err
                  })
            });
       }
    
    }