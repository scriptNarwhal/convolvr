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
            this.listFiles( component, params.username, params.dir )

        }

        if ( prop.listDirectories ) {

            params = prop.listDirectories
            this.listDirectories( component, params.username, params.dir )

        }

        if ( prop.readText ) {

            params = prop.readText
            this.readText( component, params.filename, params.username, params.dir )

        }

        if ( prop.refresh !== false )

            defaultCallbacks.push( () => {

                component.entity.updateComponentAtPath( component, component.path )
                    
            })

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
            setWorkingDirectory: ( username, dir ) => {
                this.setWorkingDirectory( component, username, dir )
            },
            createFile: ( username, dir ) => {
                this.createFile( component, username, dir )
            },
            uploadFile: ( file, username, dir ) => {
                this.uploadFile( component, file, username, dir )
            },
            listFiles: ( username, dir ) => {
                this.listFiles( component, username, dir )
            },
            listDirectories: ( username, dir ) => {
                this.listDirectories ( component, username, dir )
            },
            readText: ( filename, username, dir ) => {
                this.readText( component, filename, username, dir )
            },
            writeText: ( text, filename, username, dir ) => {
                this.writeText( component, text, filename, username, dir )
            },
            deleteFile: ( filename, username, dir ) => {
                this.deleteFile( component, filename, username, dir )
            }
        }

    }

    _handleResponse( type, data ) {

        component.state.file.res[ type ].data = data
        component.state.file.res[ type ].callbacks.forEach( callBack => {
            callBack( data )
        })

    }

    createFile ( component, username, dir ) {

        let dir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/files/${username}/${dir != null ? "?dir="+dir : ''}`, {}).then(response => {
           
           this._handleResponse( 'createFile', response.data )
          
        }).catch(err => {
           
           component.state.file.res.createFile.error = err
           
        })

    }

    uploadFile ( component, file, username, dir ) {

        let dir = !!dir ? "?dir="+dir : ""

        axios.post(`${API_SERVER}/api/files/upload/${username}${dir}`, file).then(response => {
           
            this._handleResponse( 'uploadFile', response.data )
          
        }).catch(err => {
           
            component.state.file.res.uploadFile.error = err
           
        })

    }

    createDirectory () {

        dir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/directories/${username}/${dir != null ? "?dir="+dir : ''}`, {}).then(response => {
           
            this._handleResponse( 'createDirectory', response.data )
          
        }).catch(err => {
           
           component.state.file.res.createDirectory.error = err
           
        })

    }

    listFiles ( component, username, dir ) {

        axios.get(`${API_SERVER}/api/files/list/${username}${dir != null ? "?dir="+dir : ''}`).then(response => {
             
            this._handleResponse( 'listFiles', response.data )
          
        }).catch(err => {
           
           component.state.file.res.listFiles.error = err
          
        })

    }

    listDirectories ( component, username, dir) {

        axios.get(`${API_SERVER}/api/directories/list/${username}${dir != null ? "?dir="+dir : ''}`).then(response => {
           
            this._handleResponse( 'listDirectories', response.data )
          
        }).catch(err => {
           
          component.state.file.res.listDirectories.error = err
           
        })

    }

    deleteFile (component, filename, username, dir) {

        // implement

    }

    setWorkingDirectory ( component, username, dir ) {

        component.state.file.workingDirectory = username+dir
        component.state.file.workingPath = (username+dir).split("/")

    }

    readText ( component, filename, username, dir ) {

        axios.get(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`).then(response => {
           
            this._handleResponse( 'readText', response.data )
          
        }).catch(err => {
           
          component.state.file.res.readText.error = err
            
        })

    }

    writeText ( component, text, filename, username, dir ) {

        let dir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`, {text: text}).then(response => {
           
            this._handleResponse( 'writeText', response.data )
          
        }).catch(err => {

           component.state.file.res.writeText.error = err
          
        })

    }

}

