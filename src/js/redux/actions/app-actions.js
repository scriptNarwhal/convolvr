import axios from 'axios';
import {
    APP_TOGGLE_MENU,
    APP_TOGGLE_VR
} from '../constants/action-types';
import { API_SERVER } from '../../config.js'

export function toggleMenu (id) {
    return {
        type: APP_TOGGLE_MENU
    }
}

export function toggleVR (id) {
    return {
        type: APP_TOGGLE_VR
    }
}
