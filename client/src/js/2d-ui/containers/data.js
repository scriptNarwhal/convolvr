import React, { Component } from 'react'
import Shell from '../shell'
import Card from '../card'
import LocationBar from '../location-bar'

class Data extends Component {
  componentWillMount () {
    this.props.listFiles(this.props.username)
    this.props.listDirectories(this.props.username)
  }
  componentWillUpdate (nextProps, nextState) {
    if (nextProps.workingPath.length != this.props.workingPath.length) {
      console.log("changing directory...", nextProps.workingPath)
      this.props.listFiles(this.props.username, nextProps.workingPath.join("/"))
      this.props.listDirectories(this.props.username, nextProps.workingPath.join("/"))
    }
  }
  isImage (file) {
    return /(.png|.jpg|.jpeg|.gif|webp)/.test(file)
  }
  getFullPath (file, thumbnail) {
    let username = this.props.username,
        workingPath = this.props.workingPath.join("/")
    if (thumbnail && this.isImage(file)) {
      return `/data/${username}/${workingPath}/thumbs/${file}.jpg`
    } else {
      return `/data/${username}/${workingPath}/${file}`
    }
  }
  enterDirectory (dir) {
    let path = this.props.workingPath
    path.push(dir)
    this.props.changeDirectory(path)
  }
  render() {
    let files = this.props.files !== false ? this.props.files : [],
        dirs = this.props.dirs !== false ? this.props.dirs : []
    return (
        <Shell className="data-view">
          <LocationBar path={this.props.workingPath}
                       username={this.props.username}
          />
          {
            dirs.map((dir, i) => {
              return (
                <Card image={''}
                      clickHandler={ (e, title) => {
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
          {
            files.map((file, i) => {
              return (
                <Card image={this.isImage(file) ? this.getFullPath(file, true) : ''}
                      clickHandler={ (e, title) => {
                        console.log(e, title, "clicked")
                        let newWindow = window.open(this.getFullPath(file), "_blank")
                        newWindow.focus()
                      }}
                      compact={!this.isImage(file)}
                      showTitle={true}
                      title={file}
                      key={i}
                />
              )
            })
          }
        </Shell>
    )
  }
}

Data.defaultProps = {

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
  uploadFiles
} from '../../redux/actions/file-actions'
export default connect(
  (state, ownProps) => {
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
        workingPath: state.files.listDirectories.workingPath,
        upload: state.files.uploadMultiple
    }
  },
  dispatch => {
    return {
      listFiles: (username, dir) => {
          dispatch(listFiles(username, dir))
      },
      listDirectories: (username, dir) => {
          dispatch(listDirectories(username, dir))
      },
      changeDirectory: (path) => {
        dispatch(changeDirectory(path))
      },
      toggleMenu: (toggle) => {
        dispatch(toggleMenu(toggle))
      },
      uploadFile: (file, username, dir) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)(Data)
