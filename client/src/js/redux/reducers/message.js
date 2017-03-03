import {
    MESSAGE_SEND,
    MESSAGE_GET,
    CHAT_HISTORY_FETCH,
    CHAT_HISTORY_DONE,
    CHAT_HISTORY_FAIL
} from '../constants/action-types';

module.exports = function messages (state = {
    messages:[],
    fetching: false,
    historyErr: false
}, action) {
  switch (action.type) {
    case MESSAGE_SEND:
      return state;
    case MESSAGE_GET:
        return Object.assign({}, state, {
            messages: [
                ...state.messages,
                {
                  message: action.message,
                  from: action.from,
                  files: action.files
                }
            ]
      })
    case CHAT_HISTORY_FETCH:
      return Object.assign({}, state, {
        fetching: true
      })
    case CHAT_HISTORY_DONE:
      return Object.assign({}, state, {
        messages: state.messages.concat(action.data),
        fetching: false,
        historyErr: false
      })
    case CHAT_HISTORY_FAIL:
      return Object.assign({}, state, {
        historyErr: action.data
      })
    default:
      return state;
  }
};
