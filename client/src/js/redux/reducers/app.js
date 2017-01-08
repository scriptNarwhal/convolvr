import {
    APP_TOGGLE_MENU,
    APP_TOGGLE_VR,
    APP_SHOW_CHAT,
    APP_HIDE_CHAT,
    APP_SHOW_LOGIN,
    APP_HIDE_LOGIN,
    APP_TOGGLE_FULLSCREEN,
    APP_SET_WINDOW_FOCUS
} from '../constants/action-types';

module.exports = function app (state = {
    menuOpen: false,
    vrMode: false,
    chatOpen: false,
    loginOpen: false,
    fullscreen: false,
    windowFocus: true
}, action) {
  switch (action.type) {
    case APP_TOGGLE_MENU:
        return Object.assign({}, state, {
            menuOpen: !state.menuOpen || action.force
        })
    case APP_TOGGLE_VR:
        console.log("APP_TOGGLE_VR")
        console.log("state.vrMode", !state.vrMode);
        three.world.mode = !state.vrMode ? "stereo" : "vr";
        window.three.world.toggleStereo(!state.vrMode ? "stereo" : "vr");
        return Object.assign({}, state, {
            vrMode: !state.vrMode
        })
    case APP_TOGGLE_FULLSCREEN:
        return Object.assign({}, state, {
            fullscreen: !state.fullscreen || action.force
        })
    case APP_SHOW_CHAT:
        return Object.assign({}, state, {
            chatOpen: true
        })
    case APP_HIDE_CHAT:
        return Object.assign({}, state, {
            chatOpen: false
        })
    case APP_SHOW_LOGIN:
        return Object.assign({}, state, {
            loginOpen: true
        })
    case APP_HIDE_LOGIN:
        return Object.assign({}, state, {
            loginOpen: false
        })
    case APP_SET_WINDOW_FOCUS:
        return Object.assign({}, state, {
            windowFocus: action.focus
        })
    default:
      return state;
  }
};
