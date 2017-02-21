/* General shell / dashboard UI */
import React, { Component } from 'react'
import SideMenu from './side-menu'
import { browserHistory } from 'react-router'

let styles = {
  shell: (hasMenu, menuOpen, menuOnly, noBackground) => {
    let mobile = window.innerWidth <= 640
    return {
      margin: 'auto',
      position: 'fixed',
      top: 0,
      left: 0,
      textAlign: 'center',
      width: (menuOnly && !mobile ? '72px' : '100%'),
      height: menuOnly && mobile ? '72px' : '100vh',
      display: (menuOpen  ? "block" : "none"),
      zIndex: (hasMenu ? 999999 : 1),
      cursor: 'pointer',
      backgroundImage: noBackground ? 'none' : 'linear-gradient(to bottom, #0c0c0c, #111111, #212121)',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: '20px' //scrollbars are ugly (minimap would be nicer)
    }
  },
  inner: () => {
    let mobile = window.innerWidth <= 640
    return {
      paddingTop: mobile ? '86px' : '48px',
      paddingLeft: mobile ? '0px' : '72px'
    }
  }
}

class Shell extends Component {
  componentWillMount () {

  }
  componentWillUpdate(nextProps, nextState) {

  }
  uploadFiles (files) {
		console.log("uploading files")
		let xhr = new XMLHttpRequest(),
			  formData = new FormData(),
			  ins = files.length,
        thumbs = [],
        images = /(\.jpg|\.jpeg|\.png|\.webp)$/i,
        username = this.props.username,
        fileNames = []

    if (username == 'Human') {
      username = 'public'
    }
		for (let x = 0; x < ins; x++) {
      if (images.test(files[x].name)) {
        thumbs.push(files[x]);
      }
		  formData.append("files", files[x]);
      fileNames.push(files[x].name)
		}
		xhr.onload = function () {
			if (xhr.status == 200) {
				console.log("finished uploading")
			}
		}
		xhr.open("POST", "/api/files/upload-multiple/"+username+"/chat-uploads", true);
		//xhr.setRequestHeader("x-access-token", localStorage.getItem("token"));
		if ("upload" in new XMLHttpRequest) { // add upload progress event
				xhr.upload.onprogress = function (event) {
				if (event.lengthComputable) {
					let complete = (event.loaded / event.total * 100 | 0);
					console.log(complete)
				}
      }
		}
    xhr.send(formData)
    let from = this.props.username
    setTimeout(()=>{
      this.props.sendMessage("File"+(ins > 1 ? "s" : "")+" Uploaded: "+fileNames.join(", "), from, fileNames)
    }, 500)

  }
  render() {
    let hasMenu = !!this.props.hasMenu,
        menuOnly = !!this.props.menuOnly,
        menuOpen = this.props.menuOpen,
        noBackground = this.props.noBackground
    return (
        <div style={styles.shell(hasMenu, menuOpen, menuOnly, noBackground)}
             onDrop={e=> {
                        e.stopPropagation()
                        e.preventDefault()
                        this.uploadFiles(e.target.files || e.dataTransfer.files)}
                    }
            onDragEnter={e=>{ console.log(e); e.preventDefault();  e.stopPropagation(); }}
            onDragOver={e=>{ console.log(e);   e.preventDefault(); e.stopPropagation(); }}
            onDragLeave={e=>{ console.log(e); e.preventDefault();  e.stopPropagation(); }}
          onClick={e=> {
            if (e.target.getAttribute('id') == 'shell') {
              this.props.toggleMenu()
            }
          }}
          className='shell'
          id='shell'
        >
            {hasMenu ? (
              <SideMenu />
            ) : ''}
            {menuOnly ? '' : (
              <div style={styles.inner()}>
                  {this.props.children}
              </div>
            )}
        </div>
    )
  }
}

Shell.defaultProps = {
  noBackground: false
}

import { connect } from 'react-redux'
import { toggleMenu, toggleVR } from '../redux/actions/app-actions'
import {
    sendMessage
} from '../redux/actions/message-actions'

export default connect(
  state => {
    return {
      menuOpen: state.app.menuOpen,
      username: state.users.loggedIn != false ? state.users.loggedIn.name : "Human",
      platforms: state.platforms,
      tracks: state.tracks,
      tools: state.tools,
      users: state.users,
      stereoMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      toggleMenu: () => {
        dispatch(toggleMenu())
      },
      sendMessage: (message, from, files) => {
        dispatch(sendMessage(message, from, files))
      },
    }
  }
)(Shell)
