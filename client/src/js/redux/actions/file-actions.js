import {
    FILES_LIST_FETCH,
    FILES_LIST_FAIL,
    FILES_LIST_DONE,
    FILE_DELETE_FETCH,
    FILE_DELETE_DONE,
    FILE_DELETE_FAIL,
    FILE_UPLOAD_FETCH,
    FILE_UPLOAD_DONE,
    FILE_UPLOAD_FAIL,
    FILES_UPLOAD_FETCH,
    FILES_UPLOAD_DONE,
    FILES_UPLOAD_FAIL,
    TEXT_READ_FETCH,
    TEXT_READ_DONE,
    TEXT_READ_FAIL,
    TEXT_WRITE_FETCH,
    TEXT_WRITE_DONE,
    TEXT_WRITE_FAIL,
    DIRECTORIES_LIST_FETCH,
    DIRECTORIES_LIST_FAIL,
    DIRECTORIES_LIST_DONE,
    DIRECTORIES_MAKE_FETCH,
    DIRECTORIES_MAKE_FAIL,
    DIRECTORIES_MAKE_DONE,
    CHANGE_DIRECTORY
} from '../constants/action-types';
import axios from 'axios';
import { API_SERVER } from '../../config.js'

export function listFiles (username, dir) {
    return dispatch => {
     dispatch({
         type: FILES_LIST_FETCH,
         username,
         dir
     })
     return axios.get(`${API_SERVER}/api/files/list/${username}${dir != null && dir != '' ? '/'+dir : ''}`)
        .then(response => {
            dispatch({
                type: FILES_LIST_DONE,
                data: response.data
            })
        }).catch(response => {
            dispatch({
                type: FILES_LIST_FAIL,
                error: response
            })
        })
   }
}
export function uploadFile (file, username, dir) {
    return dispatch => {
     dispatch({
         type: FILE_UPLOAD_FETCH,
         username,
         dir
     })
     let dir = !!dir && dir != "" ? "/"+dir : ""
     return axios.post(API_SERVER+"/api/files/upload/"+username+dir, file)
        .then(response => {
            dispatch({
                type: FILE_UPLOAD_DONE,
                data: response.data
            })
        }).catch(response => {
            dispatch({
                type: FILE_UPLOAD_FAIL,
                error: response
            })
        })
   }
}
export function listDirectories (username, dir) {
    return dispatch => {
     dispatch({
         type: DIRECTORIES_LIST_FETCH,
         username,
         dir
     })
     return axios.get(`${API_SERVER}/api/directories/list/${username}${dir != null && dir != '' ? '/'+dir : ''}`)
        .then(response => {
            dispatch({
                type: DIRECTORIES_LIST_DONE,
                data: response.data
            })
        }).catch(response => {
            dispatch({
                type: DIRECTORIES_LIST_FAIL,
                error: response
            })
        })
   }
}
export function changeDirectory (dir) {
  return {
    type: CHANGE_DIRECTORY,
    dir
  }
}
