import {
    NETWORK_DOMAIN_LIST,
    NETWORK_DOMAIN_LIST_DONE,
    NETWORK_DOMAIN_LIST_FAIL
} from '../constants/action-types'

module.exports = function worlds (state = {
    error: false,
    fetching: false,
    data: false
}, action) {
  switch (action.type) {
    case NETWORK_DOMAIN_LIST:
      return Object.assign({}, state, {
          fetching: true
      })
    case NETWORK_DOMAIN_LIST_DONE:
      return Object.assign({}, state, {
          fetching: false,
          data: action.data,
          error: action.err
      })
    case NETWORK_DOMAIN_LIST_FAIL:
      return Object.assign({}, state, {
          data: false,
          fetching: false
      })
    default:
      return state;
  }
};
