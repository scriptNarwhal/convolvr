import {
    TOWER_ADD,
    TOWERS_FETCH,
    TOWERS_FETCH_DONE,
    TOWERS_FETCH_FAIL,
    UPDATE_TOWER,
    DELETE_TOWER
} from '../constants/action-types';

module.exports = function towers (
    state = {
        data: [],
        fetching: false,
        error: false
    }, action) {
  switch (action.type) {
    case TOWER_ADD:
      return Object.assign({}, state, {
          data: [
              ...state.data,
              action.data
          ]
      })
    case DELETE_TOWER:

    case UPDATE_TOWER:

    case TOWERS_FETCH:
        return Object.assign({}, state, {
            fetching: true
        })
    case TOWERS_FETCH_FAIL:

    case TOWERS_FETCH_DONE:
        return Object.assign({}, state, {
            fetching: false,
            data: action.data
        })

    default:
      return state;
  }
};
