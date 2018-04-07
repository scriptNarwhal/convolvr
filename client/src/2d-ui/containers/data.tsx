import * as React from "react"; import { Component } from "react";
import Shell from '../components/shell'
import Card from '../components/card'
import LocationBar from '../components/location-bar'

class Data extends Component<any, any> {

  componentWillMount () {
    this.props.listFiles(this.props.username, this.props.workingPath.join("/"))
    this.props.listDirectories(this.props.username, this.props.workingPath.join("/"))
    this.setState({
      update: 0,
      workingPath: []
    })
  }

  componentWillReceiveProps ( nextProps: any) {
    let userNameChanged = nextProps.username != this.props.username,
        finishedFetchingDirs = this.props.dirsFetching == true && nextProps.dirsFetching == false,
        finishedFetchingFiles = (this.props.filesFetching == true && nextProps.filesFetching == false)

    if ( nextProps.workingPath.length != this.props.workingPath.length || userNameChanged ) { console.log("changing directory...", nextProps.workingPath)
      this.props.listFiles(nextProps.username, nextProps.workingPath.join("/"))
      this.props.listDirectories(nextProps.username, nextProps.workingPath.join("/"))
    }

    if ( finishedFetchingFiles || finishedFetchingDirs ) {
      let newPath: string[] = []
      nextProps.workingPath.map((p: any) => {
        newPath.push(p)
      })
      this.setState({
        update: this.state.update+1,
        workingPath: newPath
      })
    }

  }

  componentWillUpdate (nextProps: any, nextState: any) {


  }

  isImage (file: string) {
    return /(.png|.jpg|.jpeg|.gif|webp)/.test(file)
  }

  isTextFile (file: string) {
    return /(^[^.]*$|\.md|\.js|\.json|\.htm|\.css|\.go|\.java|\.py|\.xml|\.yml|\.txt|\.doc|\.csv|\.gitignore)/.test(file)
  }

  getFullPath (file: string, thumbnail?: boolean) {
    let username = this.props.username,
        workingPath = this.state.workingPath.join("/")

    if (thumbnail && this.isImage(file)) {
      return `/data/user/${username}${workingPath}/thumbs/${file}.jpg`
    } else {
      return `/data/user/${username}${workingPath}/${file}`
    }
  }

  enterDirectory (dir: string) {
    let path = this.state.workingPath;

    path.push(dir)
    this.props.changeDirectory(path)
  }

  onContextAction ( name: string, data: any, e: any ) {
    let dir = this.props.workingPath.join("/") || "/";

    switch( name ) {

      case "Download":

      break;
      case "Rename":
        this.props.launchRenameFile( this.props.username, dir, data.filename )
        //this.renameFile( this.props.username, this.props.workingPath, data.file, data.targetDir, data.targetFile )
      break;
      case "Share":
        this.props.launchSharingSettings( this.props.username, dir, data.filename )
      break;
      case "Edit":
        if ( !this.isImage( data.filename ) ) 

          this.props.launchTextEdit( this.props.username, dir, data.filename )
          
      break;
      case "Delete":
        this.props.deleteFile( this.props.username, dir, data.filename )
      break;
      case "Add To Inventory":
        this.props.launchImportToInventory( this.props.username, dir, data.filename )
      break;

    }

  }

  _renderFiles ( files: any[], mobile: boolean, thumbs: boolean ) {

    if ( !!files && !this.props.filesFetching) {

      return files.map((file: string, i: number) => {
          console.info("file ", file)
              return (
                <Card image={this.isImage(file) ? !thumbs && this.getFullPath(file, true) : ''}
                      clickHandler={ (e: any, title: string) => {
                        console.log(e, title, "clicked");
                        if ( this.isTextFile( file ) ) {
                          this.onContextAction("Edit", { filename: file }, {})
                        } else {
                          let newWindow = window.open(this.getFullPath(file), "_blank")
                          newWindow.focus()
                        }
                        
                      }}
                      compact={thumbs || !this.isImage(file) }
                      quarterSize={mobile && this.isImage(file) }
                      onContextMenu={ (name: string, data: any, e: any) => this.onContextAction(name, data, e) }
                      showTitle={true}
                      username={this.props.username}
                      dir={this.props.workingPath.join("/")}
                      title={file}
                      key={i}
                />
            )
        })

    } else {

      return ""

    } 
            
  }

  render() {
    let files = this.props.files,
        dirs = this.props.dirs,
        mobile = window.innerWidth <= 720,
        imageFiles: string[] = [],
        nonImages: string[] = []

      !! files && files.map( ( file: string ) => {
        if ( this.isImage( file ) ) {
          imageFiles.push( file )
        } else {
          nonImages.push( file )
        }
      })

    let dirName = this.state.workingPath[ this.state.workingPath.length - 1 ]

    return (
        <Shell htmlClassName="data-view">
          <div style={ mobile ? { paddingTop: "60px" } : { paddingTop: "0px" } }></div>
          <LocationBar path={this.state.workingPath}
                       label="Data"
                       username={this.props.username}
                       showFileOptions={ true } // show Upload Files, New File, New Folder
                       onItemSelect={  (item: any, index: number, length: number) => {
                          console.log("changing dir from location bar")
                          let path = this.state.workingPath
                          path.splice(index+1)
                          this.props.changeDirectory(path)
                       }}
          />
          {
            dirs !== false && !this.props.dirsFetching &&
            dirs.map((dir: string, i: number) => {
              return (
                <Card image={''}
                      clickHandler={ (e: any, title: string) => {
                        console.log(e, title, "clicked")
                        this.enterDirectory(title)
                      }}
                      compact={true}
                      showTitle={true}
                      title={dir}
                      key={i}
                />
              )
            })
          }
          <hr style={styles.hr} />
          { this.props.filesFetching == false && this._renderFiles( nonImages, mobile, dirName == 'thumbs' ) }
          <hr style={styles.hr} />
          { this.props.filesFetching == false && this._renderFiles( imageFiles, mobile, dirName == 'thumbs' ) }
        </Shell>
    )
  }
}

import { connect } from 'react-redux';
import {
    sendMessage
} from '../../redux/actions/message-actions'
import {
  toggleMenu,
  showChat
} from '../../redux/actions/app-actions'
import {
  listFiles,
  listDirectories,
  changeDirectory,
  uploadFiles,
  uploadFile,
  moveFile,
  deleteFile
} from '../../redux/actions/file-actions'
import {
  launchTextEdit,
  launchRenameFile,
  launchSharingSettings,
  launchImportToInventory
} from '../../redux/actions/util-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
        loggedIn: state.users.loggedIn,
        username: state.users.loggedIn != false ? state.users.loggedIn.name : "public",
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        chatOpen: state.app.chatOpen,
        vrMode: state.app.vrMode,
        files: state.files.list.data,
        dirs: state.files.listDirectories.data,
        filesFetching: state.files.list.fetching,
        dirsFetching: state.files.listDirectories.fetching,
        workingPath: state.files.listDirectories.workingPath,
        upload: state.files.uploadMultiple
    }
  },
  (dispatch: any) => {
    return {
      listFiles: (username: string, dir: string) => {
          dispatch(listFiles(username, dir))
      },
      listDirectories: (username: string, dir: string) => {
          dispatch(listDirectories(username, dir))
      },
      changeDirectory: (path: string[]) => {
        dispatch(changeDirectory(path))
      },
      launchTextEdit: (username: string, dir: string, filename: string) => {
        dispatch(launchTextEdit( username, dir, filename ) )
      },
      launchRenameFile: (username: string, dir: string, filename: string) => {
        dispatch(launchRenameFile( username, dir, filename ) )
      },
      launchSharingSettings: (username: string, dir: string, filename: string) => {
        dispatch(launchSharingSettings( username, dir, filename ) )
      },
      launchImportToInventory: (username: string, dir: string, filename: string) => {
        dispatch(launchImportToInventory( username, dir, filename ) )
      },
      moveFile: (username: string, dir: string, file: string, targetDir: string, targetFile: string) => {
        dispatch(moveFile(username, dir, file, targetDir, targetFile))
      },
      deleteFile: (username: string, dir: string, file: string) => {
        dispatch(deleteFile(username, dir, file))
      },
      toggleMenu: (toggle: boolean) => {
        dispatch(toggleMenu(toggle))
      },
      uploadFile: (file: string, username: string, dir: string) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)(Data)

let styles = {
  hr: {
    visibility: 'hidden'
  },

}