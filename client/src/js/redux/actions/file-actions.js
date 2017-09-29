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
    DIRECTORY_MAKE_FETCH,
    DIRECTORY_MAKE_FAIL,
    DIRECTORY_MAKE_DONE,
    CHANGE_DIRECTORY,
    MESSAGE_SEND
} from '../constants/action-types'

import axios from 'axios';
import { API_SERVER } from '../../config.js'

import { sendMessage } from './message-actions'

export function listFiles (username, dir) {
    return dispatch => {
     dispatch({
         type: FILES_LIST_FETCH,
         username,
         dir
     })
     return axios.get(`${API_SERVER}/api/files/list/${username}${dir != null ? "?dir="+dir : ''}`)
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
     let dir = !!dir ? "?dir="+dir : ""
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

export function uploadFiles ( files, username, dir ) {
    return (dispatch, getState) => {

    let state = getState()

     dispatch({
         type: FILE_UPLOAD_FETCH,
         username,
         dir
     }) 

     if ( !!state.worlds.current ) {

      if ( (dir == "/" || dir == "") && state.worlds.worldUser == state.users.loggedIn.name ) {

        dir = "/worlds/"+state.worlds.current

      } 

    }

    if ( window.location.href.indexOf("/chat") > -1 ) {
      dir = "chat-uploads"
    }
		
	let xhr = new XMLHttpRequest(),
		formData = new FormData(),
		ins = files.length,
        thumbs = [],
        images = /(\.jpg|\.jpeg|\.png|\.webp|\.gif|\.svg)$/i,
        fileNames = [],
        shell = this

    if (username == 'Human') {
      username = 'public'
    }

	for (let x = 0; x < ins; x++) {

        if ( images.test(files[x].name) ) {

            thumbs.push(files[x])

        }
	
        formData.append("files", files[x])
        fileNames.push(files[x].name.replace(/\s/g, '-'))

	}
	
    xhr.onload = () => {

		if ( xhr.status == 200 ) {

		    console.log("finished uploading")

		}

	}

	xhr.open("POST", "/api/files/upload-multiple/"+username+"?dir="+dir, true);

		//xhr.setRequestHeader("x-access-token", localStorage.getItem("token"));
		if ("upload" in new XMLHttpRequest) { // add upload progress event
			
            xhr.upload.onprogress = function ( event ) {

				if (event.lengthComputable) {

					let complete = (event.loaded / event.total * 100 | 0);
					console.log(complete)

                    if (complete == 100) {

                        if (window.location.href.indexOf("/chat") > -1) {

                            setTimeout(()=>{
                                dispatch(
                                    sendMessage(
                                        "Uploaded "+(ins > 1 ? ins+ " Files" : "a File"),
                                        username,
                                        fileNames
                                    )
                                ) 
                        
                            }, 500)

                        }
        
                    }
				}
            }

	    }
        
        xhr.send(formData)

   }

}

export function listDirectories (username, dir) {
    return dispatch => {
     dispatch({
         type: DIRECTORIES_LIST_FETCH,
         username,
         dir
     })
     return axios.get(`${API_SERVER}/api/directories/list/${username}${dir != null ? "?dir="+dir : ''}`)
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

export function createFile (username, dir) {
    return dispatch => {
     dispatch({
         type: FILE_CREATE_FETCH,
         username,
         dir
     })
     return axios.post(`${API_SERVER}/api/files/${username}/${dir != null ? "?dir="+dir : ''}`, {})
        .then(response => {
            dispatch({
                type: FILE_CREATE_DONE,
                data: response.data
            })
        }).catch(response => {
            dispatch({
                type: FILE_CREATE_FAIL,
                error: response.data
            })
        })
   }
}

export function createDirectory ( username, dir ) {
    return dispatch => {
     dispatch({
         type: DIRECTORY_MAKE_FETCH,
         username,
         dir
     })
     return axios.post(`${API_SERVER}/api/directories/${username}?dir=${dir}`, {})
        .then(response => {
            dispatch({
                type: DIRECTORY_MAKE_DONE,
                data: response.data
            })
        }).catch(response => {
            dispatch({
                type: DIRECTORY_MAKE_FAIL,
                error: response.data
            })
        })
   }
}

export function readText (filename, username, dir) {
    return dispatch => {
     dispatch({
         type: TEXT_READ_FETCH,
         username,
         dir
     })
     return axios.get(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`)
        .then(response => {
            dispatch({
                type: TEXT_READ_DONE,
                data: response.data,
                dir
            })
        }).catch(response => {
            dispatch({
                type: TEXT_READ_FAIL,
                error: response,
                dir
            })
        })
   }
}

export function writeText (text, filename, username, dir) {
    return dispatch => {
     
    dispatch({
         type: TEXT_WRITE_FETCH,
         username,
         dir
     })

     let data = { text, username, name: filename, path: dir }

     return axios.post(`${API_SERVER}/api/documents/${username}/${filename}`, data )
        .then(response => {
            dispatch({
                type: TEXT_WRITE_DONE,
                data: response.data
            })
        }).catch(response => {
            dispatch({
                type: TEXT_WRITE_FAIL,
                error: response.data
            })
        })
   }
}

export function changeDirectory (path) {
  return {
    type: CHANGE_DIRECTORY,
    path
  }
}
