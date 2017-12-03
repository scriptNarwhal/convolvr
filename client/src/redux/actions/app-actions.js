import axios from 'axios';
import {
    APP_TOGGLE_MENU,
    APP_TOGGLE_VR,
    APP_SHOW_CHAT,
    APP_HIDE_CHAT,
    APP_HIDE_LOGIN,
    APP_TOGGLE_FULLSCREEN,
    APP_SET_WINDOW_FOCUS
} from '../constants/action-types';
import { API_SERVER } from '../../config.js'

export function toggleMenu ( force ) {
    console.log("toggle menu ", force)
    let world = window.three.world,
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
        if (world.settings.blurEffect) 

            document.querySelector("#viewport").setAttribute("class", `viewport ${mode == "web" ? "blurred" : ""}`)
        
    } 
    
    return {
        type: APP_TOGGLE_MENU,
        force
    }

}

export function toggleFullscreen ( force ) {
    return {
        type: APP_TOGGLE_FULLSCREEN,
        force: force || false
    }
}

export function toggleVR ( id ) {
    return {
        type: APP_TOGGLE_VR
    }
}

export function showChat ( id ) {
    return {
        type: APP_SHOW_CHAT
    }
}

export function hideChat ( id ) {
    return {
        type: APP_HIDE_CHAT
    }
}

export function showLogin ( id ) {
    return {
        type: APP_SHOW_LOGIN
    }
}

export function hideLogin ( id ) {
    return {
        type: APP_HIDE_LOGIN
    }
}

export function setWindowFocus ( focus ) {
    return {
        type: APP_SET_WINDOW_FOCUS,
        focus
    }
}
