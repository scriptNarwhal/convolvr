/* General shell / dashboard UI */
import * as React from "react"; import { Component } from "react";
import SideMenu from './side-menu'
import Button from './button'
import { browserHistory } from 'react-router'
import { isMobile } from '../../config'

class Shell extends Component<any, any> {

  private defaultProps = {
    noBackground: false,
    innerStyle: {}
  }

  public className: string

  componentWillMount () {
    this.setState({
      droppingFile: false
    })
  }

  componentWillUpdate( nextProps: any, nextState: any ) {

  }

  uploadFiles ( files ) {
    let dir = this.props.cwd.join("/"); console.log("upload files dir ", dir)
    
    if ( !!this.props.currentSpace ) {
      if ( (dir == "/" || dir == "") && this.props.worldUser == this.props.username ) {
        dir = "/spaces/"+this.props.currentSpace
      } 
    }
    if (this.props.reactPath.indexOf("/chat") > -1) {
      dir = "chat-uploads"
    }

		let xhr = new XMLHttpRequest(),
			  formData = new FormData(),
			  ins = files.length,
        thumbs = [],
        images = /(\.jpg|\.jpeg|\.png|\.webp)$/i,
        username = this.props.username,
        fileNames: string[] = [],
        shell = this

    if (username == 'Human') {
      username = 'public'
    }
		for (let x = 0; x < ins; x++) {
      if (images.test(files[x].name)) {
        thumbs.push(files[x]);
      }
		  formData.append("files", files[x]);
      fileNames.push(files[x].name.replace(/\s/g, '-'))
		}
		xhr.onload = function () {
			if (xhr.status == 200) {
				console.log("finished uploading")
        shell.props.listFiles(shell.props.username, shell.props.cwd.join("/"))
			}
		}
		xhr.open("POST", "/api/files/upload-multiple/"+username+"?dir="+dir, true);
		//xhr.setRequestHeader("x-access-token", localStorage.getItem("token"));
		if ("upload" in new XMLHttpRequest) { // add upload progress event
				xhr.upload.onprogress = function ( event ) {
				if (event.lengthComputable) {
          let complete = (event.loaded / event.total * 100 | 0);
          
					console.log(complete)
          if (complete == 100) {
            if (window.location.href.indexOf("/chat") > -1) {
              setTimeout(()=>{
                shell.props.sendMessage("Uploaded "+(ins > 1 ? ins+ " Files" : "a File"), from, fileNames, null, window.three.world.space.name)
              }, 500)
            }
          }
				}
      }
		}
    xhr.send(formData)
    let from = this.props.username

    this.setDropBackground(false)
  }

  setDropBackground (mode: boolean) {
    this.setState({
      droppingFile: mode
    })
  }

  render() {

    let hasMenu = !!this.props.hasMenu,
        menuOnly = !!this.props.menuOnly,
        menuOpen = this.props.menuOpen,
        noBackground = this.props.noBackground
    return (
        <div style={styles.shell(hasMenu, menuOpen, menuOnly, noBackground, this.state.droppingFile) as any}
             onDrop={e=> {
                        e.stopPropagation()
                        e.preventDefault()
                        this.uploadFiles(e.target.files || e.dataTransfer.files)}
                    }
            onDragEnter={e=>{ console.log(e); e.preventDefault(); e.stopPropagation(); this.setDropBackground(true) }}
            onDragOver={e=> { console.log(e); e.preventDefault(); e.stopPropagation(); }}
            onDragLeave={e=>{ console.log(e); e.preventDefault(); e.stopPropagation(); this.setDropBackground(false) }}
          onClick={e=> {
            if (e.target.getAttribute('id') == 'shell') {
              this.props.toggleMenu(true)
            }
          }}
          className='shell'
          id='shell'
        >
            {hasMenu ? (
              <SideMenu />
            ) : ''}
            {menuOnly ? '' : (
              <div style={Object.assign({}, styles.inner(), this.props.innerStyle) as any}>
                  {this.props.children}
              </div>
            )}
        </div>
    )
  }
}

import { connect } from 'react-redux'
import { toggleMenu, toggleVR } from '../../redux/actions/app-actions'
import {
    sendMessage
} from '../../redux/actions/message-actions'
import {
  listFiles
} from '../../redux/actions/file-actions'

export default connect(
  state => {
    return {
      cwd: state.files.listDirectories.workingPath,
      currentSpace: state.spaces.current,
      worldUser: state.spaces.worldUser,
      username: state.users.loggedIn != false ? state.users.loggedIn.name : "Human",
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode,
      reactPath: state.routing.locationBeforeTransitions.pathname
    }
  },
  (dispatch: any) => {
    return {
      listFiles: (username, dir) => {
          dispatch(listFiles(username, dir))
      },
      toggleMenu: (force) => {
        dispatch(toggleMenu(force))
      },
      sendMessage: (message, from, files, avatar, space) => {
        dispatch(sendMessage(message, from, files, avatar, space))
      },
    }
  }
)(Shell)

let styles = {
  shell: (hasMenu: boolean, menuOpen: boolean, menuOnly: boolean, noBackground: boolean, droppingFile: boolean ) => {
    let mobile = isMobile()
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
      backgroundColor: droppingFile ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0)',
      backgroundImage: noBackground ? 'none' : 'linear-gradient(to bottom, #0c0c0c, #111111, #212121)', //'linear-gradient(#161616, #121212, #000000e6)', //'linear-gradient(to bottom, #0c0c0c, #111111, #212121)',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: '20px' //scrollbars are ugly (minimap would be nicer)
    }
  },
  inner: () => {
    let mobile = isMobile()
    return {
      paddingTop: mobile ? '166px' : '56px',
      paddingLeft: mobile ? '0px' : '72px'
    }
  }
}