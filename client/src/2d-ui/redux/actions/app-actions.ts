import axios from 'axios';
import {
    APP_TOGGLE_MENU,
    APP_TOGGLE_VR,
    APP_SHOW_LOGIN,
    APP_SHOW_CHAT,
    APP_HIDE_CHAT,
    APP_HIDE_LOGIN,
    APP_TOGGLE_FULLSCREEN,
    APP_SET_WINDOW_FOCUS,
    APP_NAVIGATE_TO
} from '../constants/action-types';
import { API_SERVER } from '../../../config'

export function toggleMenu ( force?: boolean ) {
    let world = (window as any).three.world,
        url = window.location.href,
        mode = world.mode

    if ( mode != "stereo" ) {

        if ( force ) {
            mode = "web"
        } else if ( force !== undefined ) {
            mode = "3d"
        } else {
            mode = (mode == "3d" ? "web" : "3d")
        }

        world.mode = mode
        world.willRender = mode != "web" || url.indexOf("chat") > -1 || url.indexOf("login") > -1;

        if (world.settings.blurEffect) 
            document.querySelector("#viewport").setAttribute("class", `viewport ${mode == "web" ? "blurred" : ""}`)
        
    } 
    
    return {
        type: APP_TOGGLE_MENU,
        force
    }
}

export function navigateTo(url: string, nativeAPI = false) {
    return {
        type: APP_NAVIGATE_TO,
        url,
        nativeAPI
    }
}

export function toggleFullscreen ( force?: boolean ) {
    return {
        type: APP_TOGGLE_FULLSCREEN,
        force: force || false
    }
}

export function toggleVR ( ) {
    return {
        type: APP_TOGGLE_VR
    }
}

export function showChat ( ) {
    return {
        type: APP_SHOW_CHAT
    }
}

export function hideChat ( ) {
    return {
        type: APP_HIDE_CHAT
    }
}

export function showLogin ( ) {
    return {
        type: APP_SHOW_LOGIN
    }
}

export function hideLogin ( ) {
    return {
        type: APP_HIDE_LOGIN
    }
}

export function setWindowFocus ( focus?: boolean ) {
    return {
        type: APP_SET_WINDOW_FOCUS,
        focus
    }
}
