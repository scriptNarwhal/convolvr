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
import Convolvr from '../../../world/world';

export default function app (state: any = {
    menuOpen: false,
    vrMode: false,
    chatOpen: false,
    loginOpen: false,
    fullscreen: false,
    windowFocus: true,
    navigateToUrl: {
        pathname: "",
        nativeAPI: false,
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
        if (action.nativeAPI) {
            window.history.pushState(state.navigateToUrl.historyState, window.document.title, action.url);
        }
        return {
            ...state,
            navigateToUrl: {
                pathname: action.url,
                nativeAPI: action.nativeAPI
            }
        }
    case APP_TOGGLE_VR:
        const world = (window as any).three.world as Convolvr;
        
        world.mode = !state.vrMode ? "stereo" : "3d";
        world.systems.byName.pipeline.setIdealTime(world.mode == "stereo" ? 7 : 10);
        
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
