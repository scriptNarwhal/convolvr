import axios from 'axios'
import { API_SERVER } from '../config.js'

export default class FileSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { 

        let prop = component.props.file,
            params = {}

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

        return {
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

    createFile ( component, username, dir ) {

     dir = !!dir && dir != "" ? "/"+dir : ""

     return axios.post(`${API_SERVER}/api/files/${username}/${dir != null ? "?dir="+dir : ''}`, {}).then(response => {
           
           component.state.file.createFileResponse = response.data
          
        }).catch(err => {
           
           component.state.file.createFileError = err
           
        })

    }

    uploadFile ( component, file, username, dir ) {

    dir = !!dir ? "?dir="+dir : ""

     axios.post(API_SERVER+"/api/files/upload/"+username+dir, file).then(response => {
           
           component.state.file.uploadFileResponse = response.data
          
        }).catch(err => {
           
            component.state.file.uploadFileError = err
           
        })

    }

    createDirectory () {

        dir = !!dir && dir != "" ? "/"+dir : ""

        return axios.post(`${API_SERVER}/api/directories/${username}/${dir != null ? "?dir="+dir : ''}`, {}).then(response => {
           
           component.state.file.createDirectoryResponse = response.data
          
        }).catch(err => {
           
           component.state.file.createDirectoryError = err
           
        })

    }

    listFiles ( component, username, dir ) {

        axios.get(`${API_SERVER}/api/files/list/${username}${dir != null ? "?dir="+dir : ''}`).then(response => {
             
            component.state.file.listFilesResponse.data
          
        }).catch(err => {
           
           component.state.file.listFilesError = err
          
        })

    }

    listDirectories ( component, username, dir) {

        axios.get(`${API_SERVER}/api/directories/list/${username}${dir != null ? "?dir="+dir : ''}`).then(response => {
           
          component.state.file.listDirectoriesResponse = response.data
          
        }).catch(err => {
           
          component.state.file.listDirectoriesError = err
           
        })

    }

    deleteFile (component, filename, username, dir) {

        // implement

    }

    setWorkingDirectory ( component, username, dir ) {

        component.state.file.workingDirectory = username+dir

    }

    readText ( component, filename, username, dir ) {

        axios.get(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`).then(response => {
           
           component.state.file.readTextResponse = response.data
          
        }).catch(err => {
           
          component.state.file.readTextError = err
            
        })

    }

    writeText ( component, text, filename, username, dir ) {

        dir = !!dir && dir != "" ? "/"+dir : ""
        axios.post(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`, {text: text}).then(response => {
           
           component.state.file.writeTextResponse = response.data
          
        }).catch(err => {

           component.state.file.writeTextError = err
          
        })

    }

}

