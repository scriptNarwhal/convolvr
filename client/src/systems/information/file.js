import axios from 'axios'
import { API_SERVER } from '../../config.js'

export default class FileSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) { 

        let prop = component.props.file,
            defaultCallbacks = [],
            params = {},
            res = {}

        if ( prop.listFiles ) { // init logic here... only read methods; (write logic triggered by events)
            params = prop.listFiles
            this._listFiles( component, params.username, params.dir )
        }
        if ( prop.listDirectories ) {
            params = prop.listDirectories
            this._listDirectories( component, params.username, params.dir )
        }
        if ( prop.readText ) {
            params = prop.readText
            this._readText( component, params.filename, params.username, params.dir )
        }

        if ( prop.refresh !== false )

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
                this._renderFiles( component, username, string )
            },
            renderDirectories: (username: string, dir: string) => {
                this._renderDirectories( component, username, string )
            },
            setWorkingDirectory: ( username, dir ) => {
                this._setWorkingDirectory( component, username, dir )
            },
            createFile: ( username, dir ) => {
                this._createFile( component, username, dir )
            },
            uploadFile: ( file, username, dir ) => {
                this._uploadFile( component, file, username, dir )
            },
            listFiles: ( username, dir ) => {
                this._listFiles( component, username, dir )
            },
            listDirectories: ( username, dir ) => {
                this._listDirectories ( component, username, dir )
            },
            readText: ( filename, username, dir ) => {
                this._readText( component, filename, username, dir )
            },
            writeText: ( text, filename, username, dir ) => {
                this._writeText( component, text, filename, username, dir )
            },
            deleteFile: ( filename, username, dir ) => {
                this._deleteFile( component, filename, username, dir )
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
                props: {
                    ...component.data.props,
                    metaFactory: { // generates factory for each item in dataSource
                        type: "file", // entity, prop, place, world, user, file, directory
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
                props: {
                    ...component.data.props,
                    metaFactory: { // generates factory for each item in dataSource
                        type: "directory", // entity, prop, place, world, user, file, directory
                        dataSource: dirs
                    }
                }
            }

        entity.updateComponentAtPath( directoryViewer, component.path )
        entity.reInit()
    }

    _createFile ( component, username, dir ) {

        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/files/${username}/${dir != null ? "?dir="+outDir : ''}`, {}).then(response => {
           this._handleResponse( 'createFile', response.data )
        }).catch(err => {
           component.state.file.res.createFile.error = err 
        })
    }

    _uploadFile ( component, file, username, dir ) {

        let outDir = !!dir ? "?dir="+dir : ""

        axios.post(`${API_SERVER}/api/files/upload/${username}${outDir}`, file).then(response => {
            this._handleResponse( 'uploadFile', response.data )
        }).catch(err => {
            component.state.file.res.uploadFile.error = err
        })
    }

    _createDirectory () {

        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/directories/${username}/${dir != null ? "?dir="+outDir : ''}`, {}).then(response => {
            this._handleResponse( 'createDirectory', response.data )
        }).catch(err => {
           component.state.file.res.createDirectory.error = err 
        })
    }

    _listFiles ( component, username, dir ) {

        axios.get(`${API_SERVER}/api/files/list/${username}${dir != null ? "?dir="+dir : ''}`).then(response => {
            this._handleResponse( 'listFiles', response.data )
        }).catch(err => {
           component.state.file.res.listFiles.error = err
        })
    }

    _listDirectories ( component, username, dir) {

        axios.get(`${API_SERVER}/api/directories/list/${username}${dir != null ? "?dir="+dir : ''}`).then(response => {
           
            this._handleResponse( 'listDirectories', response.data )
          
        }).catch(err => {
          component.state.file.res.listDirectories.error = err 
        })
    }

    _deleteFile (component, filename, username, dir) {

        //TODO: implement

    }

    _setWorkingDirectory ( component, username, dir ) {
        component.state.file.workingDirectory = username+dir
        component.state.file.workingPath = (username+dir).split("/")
    }

    _readText ( component, filename, username, dir ) {

        axios.get(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`).then(response => {
            this._handleResponse( 'readText', response.data )
        }).catch(err => {
          component.state.file.res.readText.error = err  
        })
    }

    _writeText ( component, text, filename, username, dir ) {

        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+outDir : ''}`, {text: text}).then(response => {
            this._handleResponse( 'writeText', response.data )
        }).catch(err => {
           component.state.file.res.writeText.error = err
        })
    }
}

