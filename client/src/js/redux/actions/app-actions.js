import axios from 'axios';
import {
    APP_TOGGLE_MENU,
    APP_TOGGLE_VR,
    APP_SHOW_CHAT,
    APP_HIDE_CHAT,
    APP_SHOW_CHAT,
    APP_HIDE_LOGIN,
    APP_TOGGLE_FULLSCREEN
} from '../constants/action-types';
import { API_SERVER } from '../../config.js'

export function toggleMenu (force) {
    return {
        type: APP_TOGGLE_MENU,
        force: force || false
    }
}
export function toggleFullscreen (force) {
    return {
        type: APP_TOGGLE_FULLSCREEN,
        force: force || false
    }
}
export function toggleVR (id) {
    return {
        type: APP_TOGGLE_VR
    }
}
export function showChat (id) {
    return {
        type: APP_SHOW_CHAT
    }
}
export function hideChat (id) {
    return {
        type: APP_HIDE_CHAT
    }
}
export function showLogin (id) {
    return {
        type: APP_SHOW_LOGIN
    }
}
export function hideLogin (id) {
    return {
        type: APP_HIDE_LOGIN
    }
}
