import {
    TOOL_ADD,
    TOOLS_FETCH,
    TOOLS_FETCH_DONE,
    TOOLS_FETCH_FAILED,
    UPDATE_TOOL,
    TOOL_DELETE,
    TOOL_NEXT,
    TOOL_PREVIOUS,
    TOOL_USE
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function addTool (data) {
    return {
        type: TOOL_ADD,
        data: data
    }
}
export function useTool (id) {
    return {
        type: TOOL_USE,
        index: id
    }
}
export function nextTool (hand) {
    return {
        type: TOOL_NEXT,
        hand
    }
}
export function previousTool (hand) {
    return {
        type: TOOL_PREVIOUS,
        hand
    }
}
export function fetchTools (id) {
    return dispatch => {
     dispatch({
         type: TOOLS_FETCH,
         id: id
     })
     return axios.get(API_SERVER+"/api/tools"+id)
        .then(response => {
            dispatch(receiveTools(response))
        }).catch(response => {
            dispatch(failedFetchTools(response))
        });
   }
}
export function requestTools (tools) {
    return {
        type: REQUEST_TOOLS,
        tools: tools
    }
}
export function receiveTools (tools) {
    return {
        type: TOOLS_FETCH_DONE,
        tools: tools
    }
}
export function failedFetchTools (err) {
    return {
        type: TOOLS_FETCH_FAILED,
        err: err
    }
}
export function deleteTool (id) {
    return {
        type: TOOL_DELETE
    }
}
