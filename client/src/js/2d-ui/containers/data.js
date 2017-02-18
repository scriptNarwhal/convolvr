import React, { Component } from 'react'
import Shell from '../shell'

class Data extends Component {
  isImage (file) {
    return /(.png|.jpg|.jpeg|.gif|webp)/.test(file)
  }
  render() {
    let files = this.props.files || []
    return (
        <Shell className="data-view">
          {
            files.map((file, i) => {
              return (
                <Card

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
export default connect(
  (state, ownProps) => {
    return {
        loggedIn: state.users.loggedIn,
        username: state.users.loggedIn != false ? state.users.loggedIn.name : "Human",
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        chatOpen: state.app.chatOpen,
        vrMode: state.app.vrMode,
        files: state.files.list.data,
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
