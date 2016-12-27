import {
    MESSAGE_SEND,
    MESSAGE_GET
} from '../constants/action-types';

module.exports = function messages (state = {
    messages:[]
}, action) {
  switch (action.type) {
    case MESSAGE_SEND:
      return state;
    case MESSAGE_GET:
        return Object.assign({}, state, {
            messages: [
                ...state.messages,
                message
            ]
      })
    default:
      return state;
  }
};
