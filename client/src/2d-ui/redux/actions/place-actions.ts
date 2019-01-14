import {
  PLACE_SET_CURRENT,
  PLACE_CREATE_FETCH,
  PLACE_CREATE_DONE,
  PLACE_CREATE_FAIL,
  PLACES_FETCH,
  PLACES_FETCH_DONE,
  PLACES_FETCH_FAIL,
  USER_PLACES_FETCH,
  USER_PLACES_FETCH_FAIL,
  USER_PLACES_FETCH_DONE,
  PLACE_UPDATE_FETCH,
  PLACE_UPDATE_DONE,
  PLACE_UPDATE_FAIL,
  PLACE_DELETE_FETCH,
  PLACE_DELETE_DONE,
  PLACE_DELETE_FAIL,
  PLACE_FETCH,
  PLACE_FETCH_DONE,
  PLACE_FETCH_FAIL,
} from '../constants/action-types'
import axios from 'axios'
import { API_SERVER } from '../../../config'
import { navigateTo } from './app-actions';

export function fetchPlaces () {

    return (dispatch: any) => {
     dispatch({
        type: PLACES_FETCH
     })
     return axios.get(API_SERVER+"/api/places")
        .then((res: any) => {
            (window as any).three.world.systems.byName.assets.setPlaces( res.data )
            dispatch({
                type: PLACES_FETCH_DONE,
                places: res.data
            })
        }).catch( (err: any) => {
            dispatch({
                type: PLACES_FETCH_FAIL,
                err: err
            })
        });
   }

}

export function fetchPlace ( username: string, placename: string) {
    
        return (dispatch: any) => {
         dispatch({
            type: PLACE_FETCH
         })
         return axios.get(API_SERVER+`/api/places/${username}/${placename}`)
            .then((res: any) => {
                dispatch({
                    type: PLACE_FETCH_DONE,
                    data: res.data
                })
            }).catch((err: any) => {
                dispatch({
                    type: PLACE_FETCH_FAIL,
                    err: err
                })
            });
       }
    
    }

export function fetchUserPlaces( userId: any ) {

    return (dispatch: any) => {
     dispatch({
        type: USER_PLACES_FETCH,
        userId
     })
     return axios.get(API_SERVER+"/api/places/user/"+userId)
        .then(res => {
            dispatch({
                type: USER_PLACES_FETCH_DONE,
                data: res.data
            })
        }).catch(err => {
            dispatch({
                type: USER_PLACES_FETCH_FAIL,
                err: err
            })
        });
   }

}

export function createPlace( data: any ) {

    return (dispatch: any) => {
     dispatch({
        type: PLACES_FETCH,
        data
     })
     return axios.post(API_SERVER+"/api/places", data)
        .then((response: any) => {
            dispatch(createPlaceDone(response))
            dispatch(navigateTo("/"+data.userName+"/"+data.name))
            window.location.href = window.location.href  /* work around */
            // this should.. work differently
        }).catch((response: any) => {
            dispatch(createPlaceFail(response))
        });
   }

}

export function createPlaceDone( res: any ) {

    return {
        type: PLACE_CREATE_DONE,
        created: res.data
    }

}
export function createPlaceFail( err:any ) {

    return {
        type: PLACE_CREATE_FAIL,
        err
    }

}
export function setCurrentPlace( world: string, user: string, place: string ) {

  return {
    type: PLACE_SET_CURRENT,
    current: place,
    world,
    user
  }

}
export function updatePlace (id: any, data: any) {

    return (dispatch: any) => {
     dispatch({
        type: PLACE_UPDATE_FETCH,
        id: id
     })
     return axios.post(API_SERVER+"/api/places/"+id, data)
        .then((response: any) => {
            dispatch(updatePlaceDone(response))
        }).catch((response: any) => {
            dispatch(updatePlaceFail(response))
        });
   }

}
export function updatePlaceDone (res: any) {

    return {
        type: PLACE_UPDATE_DONE,
        updated: res.data
    }

}
export function updatePlaceFail(err: any) {

    return {
        type: PLACE_UPDATE_FAIL,
        err
    }

}

export function deletePlace (id: any, data: any) {

    return (dispatch: any) => {
     dispatch({
        type: PLACE_DELETE_FETCH,
        id: id
     })
     return axios.post(API_SERVER+"/api/places/delete/"+id)
        .then((response: any) => {
            dispatch(deletePlaceDone(response))
        }).catch((response: any) => {
            dispatch(deletePlaceFail(response))
        });
   }

}
export function deletePlaceDone (res: any) {

    return {
        type: PLACE_DELETE_DONE,
        details: res.data
    }

}
export function deletePlaceFail(err: any) {

    return {
        type: PLACE_DELETE_FAIL,
        err
    }

}
