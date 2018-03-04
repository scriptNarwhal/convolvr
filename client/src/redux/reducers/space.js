import {
    WORLD_SET_CURRENT,
    WORLD_CREATE_FETCH,
    WORLD_CREATE_DONE,
    WORLD_CREATE_FAIL,
    WORLDS_FETCH,
    WORLDS_FETCH_DONE,
    WORLDS_FETCH_FAIL,
    USER_WORLDS_FETCH,
    USER_WORLDS_FETCH_DONE,
    USER_WORLDS_FETCH_FAIL,
    WORLD_UPDATE_FETCH,
    WORLD_UPDATE_DONE,
    WORLD_UPDATE_FAIL,
    WORLD_DELETE_FETCH,
    WORLD_DELETE_DONE,
    WORLD_DELETE_FAIL,
    UNIVERSE_SETTINGS_FETCH,
    UNIVERSE_SETTINGS_FETCH_DONE,
    UNIVERSE_SETTINGS_FETCH_FAIL,
    UNIVERSE_SETTINGS_UPDATE_FETCH,
    UNIVERSE_SETTINGS_UPDATE_DONE,
    UNIVERSE_SETTINGS_UPDATE_FAIL
} from '../constants/action-types'
import { detectSpaceDetailsFromURL } from '../../config'

function spaces (state = {
    current: detectSpaceDetailsFromURL()[1],
    worldUser: detectSpaceDetailsFromURL()[0],
    all: [],
    userSpaces: [],
    updated: false,
    created: false,
    error: false,
    fetching: false,
    fetchingUserSpaces: false,
    fetchingSettings: false,
    universeSettings: {
      id: 1,
      defaultSpace: "Overworld",
      welcomeMessage: "Welcome to Convolvr!"
    }
}, action) {
  switch (action.type) {
    case WORLD_SET_CURRENT:
      return Object.assign({}, state, {
          current: action.current
      })
    case WORLD_CREATE_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case WORLD_CREATE_DONE:
      return Object.assign({}, state, {
          created: action.created,
          fetching: false
      })
    case WORLD_CREATE_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.err
      })
    case WORLDS_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case WORLDS_FETCH_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.err
      })
    case WORLDS_FETCH_DONE:
      return Object.assign({}, state, {
          all: action.spaces,
          fetching: false
      })
    case USER_WORLDS_FETCH:
      return Object.assign({}, state, {
          fetchingUserSpaces: true
      })
    case USER_WORLDS_FETCH_FAIL:
      return Object.assign({}, state, {
          fetchingUserSpaces: false,
          error: action.err
      })
    case USER_WORLDS_FETCH_DONE:
      return Object.assign({}, state, {
          userSpaces: action.data,
          fetchingUserSpaces: false
      })
    case WORLD_UPDATE_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case WORLD_UPDATE_DONE:
      return Object.assign({}, state, {
          updated: action.updated,
          fetching: false
      })
    case WORLD_UPDATE_FAIL:
      return Object.assign({}, state, {
          error: action.err,
          fetching: false
      })
      case UNIVERSE_SETTINGS_FETCH:
        return Object.assign({}, state, {
            fetchingSettings: true
        })
      case UNIVERSE_SETTINGS_FETCH_DONE:
        return Object.assign({}, state, {
            fetchingSettings: false,
            universeSettings: action.settings
        })
      case UNIVERSE_SETTINGS_FETCH_FAIL:
        return Object.assign({}, state, {
            fetchingSettings: false
        })
      case UNIVERSE_SETTINGS_UPDATE_FETCH:
        return Object.assign({}, state, {
            fetchingSettings: true
        })
      case UNIVERSE_SETTINGS_UPDATE_DONE:
        return Object.assign({}, state, {
            universeSettings: action.settings,
            fetchingSettings: false
        })
      case UNIVERSE_SETTINGS_UPDATE_FAIL:
      return Object.assign({}, state, {
            error: action.err,
            fetchingSettings: false
        })
    default:
      return state;
  }
}

export default spaces
