import {
    APP_TOGGLE_MENU,
    APP_TOGGLE_VR,
    APP_SHOW_CHAT,
    APP_HIDE_CHAT,
    APP_SHOW_LOGIN,
    APP_HIDE_LOGIN,
    APP_TOGGLE_FULLSCREEN,
    APP_SET_WINDOW_FOCUS,
    APP_NAVIGATE_TO
} from '../constants/action-types';

export default function app (state: any = {
    menuOpen: false,
    vrMode: false,
    chatOpen: false,
    loginOpen: false,
    fullscreen: false,
    windowFocus: true,
    navigateToUrl: {
        pathname: "",
        historyState: {}
    }
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
        return { ... state,
            menuOpen: open
        } 
    case APP_NAVIGATE_TO: 
        window.history.pushState(state.navigateToUrl.historyState, window.document.title, action.url);
        return {
            ...state,
            navigateToUrl: {
                pathname: action.url
            }
        }
    case APP_TOGGLE_VR:
        (window as any).three.world.mode = !state.vrMode ? "stereo" : "3d";
        return { ... state,
            vrMode: !state.vrMode
        }
    case APP_TOGGLE_FULLSCREEN:
        return { ... state,
            fullscreen: !state.fullscreen || action.force
        }
    case APP_SHOW_CHAT:
        return { ... state,
            chatOpen: true
        }
    case APP_HIDE_CHAT:
        return { ... state,
            chatOpen: false
        }
    case APP_SHOW_LOGIN:
        return { ... state,
            loginOpen: true
        }
    case APP_HIDE_LOGIN:
        return { ... state,
            loginOpen: false
        }
    case APP_SET_WINDOW_FOCUS:
        return { ... state,
            windowFocus: action.focus
        }
    default:
      return state;
  }
};
