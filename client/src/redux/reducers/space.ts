import {
    SPACE_SET_CURRENT,
    SPACE_CREATE_FETCH,
    SPACE_CREATE_DONE,
    SPACE_CREATE_FAIL,
    SPACES_FETCH,
    SPACES_FETCH_DONE,
    SPACES_FETCH_FAIL,
    USER_SPACES_FETCH,
    USER_SPACES_FETCH_DONE,
    USER_SPACES_FETCH_FAIL,
    SPACE_UPDATE_FETCH,
    SPACE_UPDATE_DONE,
    SPACE_UPDATE_FAIL,
    SPACE_DELETE_FETCH,
    SPACE_DELETE_DONE,
    SPACE_DELETE_FAIL,
    UNIVERSE_SETTINGS_FETCH,
    UNIVERSE_SETTINGS_FETCH_DONE,
    UNIVERSE_SETTINGS_FETCH_FAIL,
    UNIVERSE_SETTINGS_UPDATE_FETCH,
    UNIVERSE_SETTINGS_UPDATE_DONE,
    UNIVERSE_SETTINGS_UPDATE_FAIL
} from '../constants/action-types'
import { detectSpaceDetailsFromURL } from '../../config'

function spaces (state: any = {
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
}, action: any) {
  switch (action.type) {
    case SPACE_SET_CURRENT:
      return Object.assign({}, state, {
          current: action.current
      })
    case SPACE_CREATE_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case SPACE_CREATE_DONE:
      return Object.assign({}, state, {
          created: action.created,
          fetching: false
      })
    case SPACE_CREATE_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.err
      })
    case SPACES_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case SPACES_FETCH_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.err
      })
    case SPACES_FETCH_DONE:
      return Object.assign({}, state, {
          all: action.spaces,
          fetching: false
      })
    case USER_SPACES_FETCH:
      return Object.assign({}, state, {
          fetchingUserSpaces: true
      })
    case USER_SPACES_FETCH_FAIL:
      return Object.assign({}, state, {
          fetchingUserSpaces: false,
          error: action.err
      })
    case USER_SPACES_FETCH_DONE:
      return Object.assign({}, state, {
          userSpaces: action.data,
          fetchingUserSpaces: false
      })
    case SPACE_UPDATE_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case SPACE_UPDATE_DONE:
      return Object.assign({}, state, {
          updated: action.updated,
          fetching: false
      })
    case SPACE_UPDATE_FAIL:
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
