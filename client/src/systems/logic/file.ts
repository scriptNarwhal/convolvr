import axios from 'axios'
import { API_SERVER } from '../../config.js'

export default class FileSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) { 

        let attr = component.attrs.file,
            defaultCallbacks = [],
            params = {},
            res = {}

        if ( attr.listFiles ) { // init logic here... only read methods; (write logic triggered by events)
            params = attr.listFiles
            this._listFiles( component, params.username, params.dir )
        }
        if ( attr.listDirectories ) {
            params = attr.listDirectories
            this._listDirectories( component, params.username, params.dir )
        }
        if ( attr.readText ) {
            params = attr.readText
            this._readText( component, params.filename, params.username, params.dir )
        }

        if ( attr.refresh !== false )

            // defaultCallbacks.push( () => {
            //     component.entity.updateComponentAtPath( component, component.path )
            // })

        res = {
            createFile: {
                data: null,
                error: null,
                callbacks: defaultCallbacks
            },
            uploadFile: {
                data: null,
                error: null,
                callbacks: defaultCallbacks
            },
            listFiles: {
                data: null,
                error: null,
                callbacks: defaultCallbacks
            },
            listDirectories: {
                data: null,
                error: null,
                callbacks: defaultCallbacks
            },
            readText: {
                data: null,
                error: null,
                callbacks: defaultCallbacks
            },
            writeText: {
                data: null,
                error: null,
                callbacks: defaultCallbacks
            },
            deleteFile: {
                data: null,
                error: null,
                callbacks: defaultCallbacks
            }
        }

        return {
            workingPath: [],
            workingDirectory: "/",
            res,
            renderFiles: (username: string, dir: string) => {
                this._renderFiles( componentusername: string, string )
            },
            renderDirectories: (username: string, dir: string) => {
                this._renderDirectories( componentusername: string, string )
            },
            setWorkingDirectory: ( username, dir ) => {
                this._setWorkingDirectory( componentusername: string, dir )
            },
            createFile: ( username, dir ) => {
                this._createFile( componentusername: string, dir )
            },
            uploadFile: ( fileusername: string, dir ) => {
                this._uploadFile( component, fileusername: string, dir )
            },
            listFiles: ( username, dir ) => {
                this._listFiles( componentusername: string, dir )
            },
            listDirectories: ( username, dir ) => {
                this._listDirectories ( componentusername: string, dir )
            },
            readText: ( filenameusername: string, dir ) => {
                this._readText( component, filenameusername: string, dir )
            },
            writeText: ( text, filenameusername: string, dir ) => {
                this._writeText( component, text, filenameusername: string, dir )
            },
            deleteFile: ( filenameusername: string, dir ) => {
                this._deleteFile( component, filenameusername: string, dir )
            }
        }
    }

    _handleResponse( type, data ) {

        component.state.file.res[ type ].data = data
        component.state.file.res[ type ].callbacks.forEach( callBack => {
            callBack( data )
        })
    }

    _renderFiles( component: Component, username: string, dir: string ) {

        let files = component.state.file.res.listFiles.data,
            entity = component.entity,
            fileViewer = {
                ...component.data,
                attrs: {
                    ...component.data.attrs,
                    metaFactory: { // generates factory for each item in dataSource
                        type: "file", // entity, attr, place, world, user, file, directory
                        dataSource: files
                    }
                }
            }

        entity.updateComponentAtPath( fileViewer, component.path )
        entity.reInit()
    }

    _renderDirectories( component: Component, username: string, dir: string ) {
        
        let dirs = component.state.file.res.listDirectories.data,
            entity = component.entity,
            directoryViewer = {
                ...component.data,
                attrs: {
                    ...component.data.attrs,
                    metaFactory: { // generates factory for each item in dataSource
                        type: "directory", // entity, attr, place, world, user, file, directory
                        dataSource: dirs
                    }
                }
            }

        entity.updateComponentAtPath( directoryViewer, component.path )
        entity.reInit()
    }

    _createFile ( componentusername: string, dir ) {

        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/files/${username}/${dir != null ? "?dir="+outDir : ''}`, {}).then((response: any) => {
           this._handleResponse( 'createFile', response.data )
        }).catch(err => {
           component.state.file.res.createFile.error = err 
        })
    }

    _uploadFile ( component, fileusername: string, dir ) {

        let outDir = !!dir ? "?dir="+dir : ""

        axios.post(`${API_SERVER}/api/files/upload/${username}${outDir}`, file).then((response: any) => {
            this._handleResponse( 'uploadFile', response.data )
        }).catch(err => {
            component.state.file.res.uploadFile.error = err
        })
    }

    _createDirectory () {

        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/directories/${username}/${dir != null ? "?dir="+outDir : ''}`, {}).then((response: any) => {
            this._handleResponse( 'createDirectory', response.data )
        }).catch(err => {
           component.state.file.res.createDirectory.error = err 
        })
    }

    _listFiles ( componentusername: string, dir ) {

        axios.get(`${API_SERVER}/api/files/list/${username}${dir != null ? "?dir="+dir : ''}`).then((response: any) => {
            this._handleResponse( 'listFiles', response.data )
        }).catch(err => {
           component.state.file.res.listFiles.error = err
        })
    }

    _listDirectories ( componentusername: string, dir) {

        axios.get(`${API_SERVER}/api/directories/list/${username}${dir != null ? "?dir="+dir : ''}`).then((response: any) => {
           
            this._handleResponse( 'listDirectories', response.data )
          
        }).catch(err => {
          component.state.file.res.listDirectories.error = err 
        })
    }

    _deleteFile (component, filenameusername: string, dir) {

        //TODO: implement

    }

    _setWorkingDirectory ( componentusername: string, dir ) {
        component.state.file.workingDirectory = username+dir
        component.state.file.workingPath = (username+dir).split("/")
    }

    _readText ( component, filenameusername: string, dir ) {

        axios.get(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`).then((response: any) => {
            this._handleResponse( 'readText', response.data )
        }).catch(err => {
          component.state.file.res.readText.error = err  
        })
    }

    _writeText ( component, text, filenameusername: string, dir ) {

        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+outDir : ''}`, {text: text}).then((response: any) => {
            this._handleResponse( 'writeText', response.data )
        }).catch(err => {
           component.state.file.res.writeText.error = err
        })
    }
}

