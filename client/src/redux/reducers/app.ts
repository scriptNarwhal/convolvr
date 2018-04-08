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

module.exports = function app (state: any = {
    menuOpen: false,
    vrMode: false,
    chatOpen: false,
    loginOpen: false,
    fullscreen: false,
    windowFocus: true
}, action: any) {
  switch (action.type) {
    case APP_TOGGLE_MENU:
        let force = action.force,
            open = false
            
        if (force != undefined) {
            open = force
        } else {
           open = !state.menuOpen
        }
        return Object.assign({}, state, {
            menuOpen: open
        }) 
    case APP_TOGGLE_VR:
        (window as any).three.world.mode = !state.vrMode ? "stereo" : "3d";
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
