import React, { Component } from 'react'
import Shell from '../shell'
import Card from '../card'

class Data extends Component {
  componentWillMount () {
    this.props.listFiles(this.props.username, "/")
  }
  componentWillUpdate () {

  }
  isImage (file) {
    return /(.png|.jpg|.jpeg|.gif|webp)/.test(file)
  }
  getFullPath (file) {
    let username = this.props.username,
        workingDir = this.props.workingDir
    return `/data/${username}/${workingDir}${file}`
  }
  render() {
    let files = this.props.files !== false ? this.props.files : []
    return (
        <Shell className="data-view">
          {
            files.map((file, i) => {
              return (
                <Card image={this.isImage(file) ? this.getFullPath(file) : ''}
                      clickHandler={ (e, title) => {
                        console.log(e, title, "clicked")
                        newWindow = window.open(this.getFullPath(file), "_blank")
                        newWindow.focus()
                      }}
                      showTitle={true}
                      title={file}

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
        workingDir: state.files.list.workingDir,
        upload: state.files.uploadMultiple
    }
  },
  dispatch => {
    return {
      listFiles: (username, dir) => {
          dispatch(listFiles(username, dir))
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
