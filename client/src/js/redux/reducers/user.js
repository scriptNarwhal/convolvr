import {
    USER_ADD,
    USERS_FETCH,
    USERS_FETCH_DONE,
    USERS_FETCH_FAIL,
    USER_CONNECT,
    USER_DISCONNECT,
    UPDATE_USER_FETCH,
    UPDATE_USER_DONE,
    UPDATE_USER_FAIL,
    DELETE_USER,
    LOGIN_FETCH,
    LOGIN_DONE,
    LOGIN_FAIL
} from '../constants/action-types';

module.exports = function users (state = {
    loggedIn: false,
    loginError: false,
    all: [],
    fetching: false,
    updateFetching: false,
    updateError: false
}, action) {
  switch (action.type) {
    case USER_ADD:

      return [

      ]
    case USER_CONNECT:
        return Object.assign({}, state, {
          all: [
              ...state.all,
              {
                name: action.name,
                data: action.data,
                pic: action.pic
              }
          ]
        })
    case USER_DISCONNECT:

    case DELETE_USER:

    case USERS_FETCH:
        return Object.assign({}, state, {
            fetching: true
        })
    break
    case USERS_FETCH_DONE:
        return Object.assign({}, state, {
            fetching: false,
            all: action.data.users
        })
    break
    case USERS_FETCH_FAIL:
        return Object.assign({}, state, {
            fetching: false,
            all: state.all
        })
    break
    case UPDATE_USER_FETCH:
        return Object.assign({}, state, {
            updateFetching: true
        })
    break
    case UPDATE_USER_DONE:
        return Object.assign({}, state, {
            updateFetching: false,
            updateError: false
        })
    break
    case UPDATE_USER_FAIL:
        return Object.assign({}, state, {
            updateFetching: false,
            updateError: action.error
        })
    break
    case LOGIN_FETCH:
        return Object.assign({}, state, {
            fetching: true,
            loggedIn: false
        })
    case LOGIN_DONE:
        return Object.assign({}, state, {
                fetching: false,
                loggedIn: action.data != "" ? action.data : false
        })
    case LOGIN_FAIL:
        return Object.assign({}, state, {
            fetching: false
        })

    default:
      return state;
  }
};
