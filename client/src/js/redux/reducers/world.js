import {
    WORLD_SET_CURRENT,
    WORLD_CREATE_FETCH,
    WORLD_CREATE_DONE,
    WORLD_CREATE_FAIL,
    WORLDS_FETCH,
    WORLDS_FETCH_DONE,
    WORLDS_FETCH_FAIL,
    WORLD_UPDATE_FETCH,
    WORLD_UPDATE_DONE,
    WORLD_UPDATE_FAIL,
    WORLD_DELETE_FETCH,
    WORLD_DELETE_DONE,
    WORLD_DELETE_FAIL
} from '../constants/action-types';

module.exports = function worlds (state = {
    current: "overworld",
    all: [],
    updated: false,
    created: false,
    error: false,
    fetching: false
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
          error: action.error
      })
    case WORLDS_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case WORLDS_FETCH_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.error
      })
    case WORLDS_FETCH_DONE:
      return Object.assign({}, state, {
          all: action.worlds,
          fetching: false
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
          error: action.error,
          fetching: false
      })

    default:
      return state;
  }
};
