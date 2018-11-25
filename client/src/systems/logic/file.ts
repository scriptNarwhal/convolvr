import axios from 'axios'
import { API_SERVER } from '../../config'
import Component from '../../model/component.js';
import Convolvr from '../../world/world'
import Systems from '..';

export default class FileSystem {

    world: Convolvr
    systems: Systems

    constructor ( world: Convolvr ) {
        this.world = world;
        this.systems = world.systems;
    }

    init ( component: Component ) { 

        let attr = component.attrs.file,
            defaultCallbacks: any[] = [],
            params: any = {},
            res: any = {},
            renderResponse = attr.renderResponse !== false;

        if ( attr.listFiles ) { // init logic here... only read methods; (write logic triggered by events)
            params = attr.listFiles
            this._listFiles( component, params.username, params.dir, renderResponse )
        }
        if ( attr.listDirectories ) {
            params = attr.listDirectories
            this._listDirectories( component, params.username, params.dir, renderResponse )
        }
        if ( attr.readText ) {
            params = attr.readText
            this._readText( component, params.filename, params.username, params.dir, renderResponse )
        }

        if ( attr.refresh !== false ) {

        }

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
            workingPath: [] as any[],
            workingDirectory: "/",
            res,
            renderFiles: (files: any[]) => {
                this._renderFiles( component, files)
            },
            renderDirectories: (dirs: any[]) => {
                this._renderDirectories( component, dirs)
            },
            setWorkingDirectory: (username: string, dir: string ) => {
                this._setWorkingDirectory( component, username, dir )
            },
            createFile: (username: string, dir: string ) => {
                this._createFile( component, username, dir )
            },
            uploadFile: (file: string, username: string, dir: string ) => {
                this._uploadFile( component, file, username, dir )
            },
            listFiles: (username: string, dir: string, renderResponse = true) => {
                this._listFiles( component, username, dir, renderResponse )
            },
            listDirectories: (username: string, dir: string, renderResponse = true) => {
                this._listDirectories ( component, username, dir, renderResponse )
            },
            readText: (filename: string, username: string, dir: string, renderResponse = true ) => {
                this._readText(component, filename, username, dir, renderResponse)
            },
            writeText: (text: string, filename: string, username: string, dir: string ) => {
                this._writeText(component, text, filename, username, dir )
            },
            deleteFile: (filename: string, username: string, dir: string ) => {
                this._deleteFile(component, filename, username, dir )
            }
        }
    }

    _handleResponse(component: Component, type: string, data: any) {
        component.state.file.res[ type ].data = data
        component.state.file.res[ type ].callbacks.forEach( (callBack: Function) => {
            callBack( data )
        })
    }

    _renderFiles( component: Component, files: any[]) {
        let fileViewer = { // generates factory for each item in dataSource
                        type: "file", // entity, attr, place, world, user, file, directory
                        dataSource: files
                    };
              
            console.log("render files", files)
        this.systems.extendComponent(component, "factoryProvider", fileViewer);
    }

    _renderDirectories( component: Component, dirs: any[] ) {
        let directoryViewer = {
                // generates factory for each item in dataSource
                        type: "directory", // entity, attr, place, world, user, file, directory
                        dataSource: dirs
            
                };

        this.systems.extendComponent(component, "factoryProvider", directoryViewer);
    }

    _createFile (component: Component, username: string, dir: string ) {
        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/files/${username}/${dir != null ? "?dir="+outDir : ''}`, {}).then((response: any) => {
           this._handleResponse(component,  'createFile', response.data )
        }).catch((err: any) =>{
           component.state.file.res.createFile.error = err 
        })
    }

    _uploadFile (component: Component, file: string, username: string, dir: string ) {
        let outDir = !!dir ? "?dir="+dir : ""

        axios.post(`${API_SERVER}/api/files/upload/${username}${outDir}`, file).then((response: any) => {
            this._handleResponse(component, 'uploadFile', response.data )
        }).catch((err: any) =>{
            component.state.file.res.uploadFile.error = err
        })
    }

    _createDirectory (component: Component, username: string, dir: string) {
        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/directories/${username}/${dir != null ? "?dir="+outDir : ''}`, {}).then((response: any) => {
            this._handleResponse(component,  'createDirectory', response.data )
        }).catch((err: any) =>{
           component.state.file.res.createDirectory.error = err 
        })
    }

    _listFiles (component: Component, username: string, dir: string, renderResponse: boolean ) {
        axios.get(`${API_SERVER}/api/files/list/${username}${dir != null ? "?dir="+dir : ''}`).then((response: any) => {
            this._handleResponse(component,  'listFiles', response.data )
            if (renderResponse) {
                this._renderFiles(component, response.data);
            }
        }).catch((err: any) =>{
           component.state.file.res.listFiles.error = err
        })
    }

    _listDirectories (component: Component, username: string, dir: string, renderResponse: boolean) {
        axios.get(`${API_SERVER}/api/directories/list/${username}${dir != null ? "?dir="+dir : ''}`).then((response: any) => {
            this._handleResponse(component,  'listDirectories', response.data )
            if (renderResponse) {
                this._renderDirectories(component, response.data);
            }
        }).catch((err: any) =>{
          component.state.file.res.listDirectories.error = err 
        })
    }

    _deleteFile (component: Component, filename: string, username: string, dir: string) {

        //TODO: implement

    }

    _setWorkingDirectory (component: Component, username: string, dir: string ) {
        component.state.file.workingDirectory = username+dir
        component.state.file.workingPath = (username+dir).split("/")
    }

    _readText (component: Component, filename: string, username: string, dir: string, renderResponse: boolean ) {
        axios.get(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+dir : ''}`).then((response: any) => {
            this._handleResponse(component,  'readText', response.data )
        }).catch((err: any) =>{
          component.state.file.res.readText.error = err  
        })
    }

    _writeText (component: Component, text: any, filename: string, username: string, dir: string ) {
        let outDir = !!dir && dir != "" ? "/"+dir : ""

        axios.post(`${API_SERVER}/api/documents/${username}/${filename}${dir != null ? "?dir="+outDir : ''}`, {text: text}).then((response: any) => {
            this._handleResponse(component,  'writeText', response.data )
        }).catch((err: any) =>{
           component.state.file.res.writeText.error = err
        })
    }
}

