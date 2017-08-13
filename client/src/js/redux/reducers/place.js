import {
    PLACE_SET_CURRENT,
    PLACE_CREATE_FETCH,
    PLACE_CREATE_DONE,
    PLACE_CREATE_FAIL,
    PLACES_FETCH,
    PLACES_FETCH_DONE,
    PLACES_FETCH_FAIL,
    USER_PLACES_FETCH,
    USER_PLACES_FETCH_DONE,
    USER_PLACES_FETCH_FAIL,
    PLACE_UPDATE_FETCH,
    PLACE_UPDATE_DONE,
    PLACE_UPDATE_FAIL,
    PLACE_DELETE_FETCH,
    PLACE_DELETE_DONE,
    PLACE_DELETE_FAI
} from '../constants/action-types'
import { detectWorldDetailsFromURL } from '../../config'

module.exports = function places (state = {
    current: detectWorldDetailsFromURL()[1],
    placeUser: detectWorldDetailsFromURL()[0],
    all: [],
    userPlaces: [],
    updated: false,
    created: false,
    error: false,
    fetching: false
}, action) {
  switch (action.type) {
    case PLACE_SET_CURRENT:
      return Object.assign({}, state, {
          current: action.current
      })
    case PLACE_CREATE_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case PLACE_CREATE_DONE:
      return Object.assign({}, state, {
          created: action.created,
          fetching: false
      })
    case PLACE_CREATE_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.err
      })
    case PLACES_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case PLACES_FETCH_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.err
      })
    case PLACES_FETCH_DONE:
      return Object.assign({}, state, {
          all: action.places,
          fetching: false
      })
    case USER_PLACES_FETCH:
      return Object.assign({}, state, {
          fetchingUserPlaces: true
      })
    case USER_PLACES_FETCH_FAIL:
      return Object.assign({}, state, {
          fetchingUserPlaces: false,
          error: action.err
      })
    case USER_PLACES_FETCH_DONE:
      return Object.assign({}, state, {
          userPlaces: action.data,
          fetchingUserPlaces: false
      })
    case PLACE_UPDATE_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case PLACE_UPDATE_DONE:
      return Object.assign({}, state, {
          updated: action.updated,
          fetching: false
      })
    case PLACE_UPDATE_FAIL:
      return Object.assign({}, state, {
          error: action.err,
          fetching: false
      })
    default:
      return state;
  }
};
