import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { events } from '../network/socket'
import { fetchUsers } from '../redux/actions/user-actions'
import Shell from '../components/shell'

class App extends Component {

  componentDidMount () {
    this.state = {
      unread: 0
    }
    this.props.fetchWorlds()
    events.on("chat message", message => {
      let chatMessage = JSON.parse(message.data),
          worldName = ''
    	this.props.getMessage(chatMessage.message, chatMessage.from)
      this.notify(chatMessage.message, chatMessage.from)
      worldName = this.props.world == "overworld" ? "Convolvr" : this.props.world
      if (this.props.focus == false) {
        this.setState({
          unread: this.state.unread +1
        })
        if (this.state.unread > 0) {
            document.title = `[${this.state.unread}] ${worldName}`
        }
      } else {
        document.title = worldName
      }
    })
    this.props.setCurrentWorld(window.worldName)
    window.document.body.addEventListener("keydown", (e)=>this.handleKeyDown(e), true)
    if (window.location.href.indexOf("/chat") > -1 || window.location.href.indexOf("/login") > -1) {
      this.props.toggleMenu(true);
    }
    // detect user credentials
    let rememberUser = localStorage.getItem("rememberUser"),
        username = '',
        password = '',
        autoSignIn = false
    if (rememberUser != null) {
      username = localStorage.getItem("username")
      password = localStorage.getItem("password")
      if (username != null && username != '') {
        autoSignIn = true
        this.props.login(username, password, "", "")
      }
    }
    if (!autoSignIn && this.props.loggedIn == false && window.location.href.indexOf("/chat") >-1) {
      browserHistory.push("/login")
    }
    window.onblur = () => {
      this.props.setWindowFocus(false)
      three.world.windowFocus = false
    }
    window.onfocus = () => {
      this.props.setWindowFocus(true)
      three.world.windowFocus = true
      this.setState({
        unread: 0
      })
    }
  }
  handleKeyDown (e) {
    if (e.which == 13) {
      if (!this.props.menuOpen) {
        this.props.toggleMenu(true);
        browserHistory.push("/chat")
      }
    }
  }

  notify (chatMessage, from) {
    function doNotification() {
      function onNotifyShow() {
          console.log('notification was shown!');
      }
      let Notify = window.Notify.default,
          myNotification = new Notify(`Message from ${from}`, {
          body: chatMessage,
          notifyShow: onNotifyShow
      });
      myNotification.show()
    }
    function onPermissionGranted() {
        console.log('Permission has been granted by the user');
        doNotification();
    }
    function onPermissionDenied() {
        console.warn('Permission has been denied by the user');
    }
    if (!Notify.needsPermission) {
        doNotification();
    } else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    }
  }

  render() {
    return (
        <div className="root">
            <Shell className="hud-side-menu tabs" menuOpen={this.props.menuOpen} ></Shell>
            {this.props.children}
            <div className="lightbox" style={{display: "none"}}></div>
            <canvas id="webcam-canvas"></canvas>
            <video id="webcam" ></video>
        </div>
    )
  }
}

App.defaultProps = {

}

import { connect } from 'react-redux'
import { toggleMenu, setWindowFocus } from '../redux/actions/app-actions'
import { fetchWorlds, setCurrentWorld } from '../redux/actions/world-actions'
import { getMessage } from '../redux/actions/message-actions'
import { login } from '../redux/actions/user-actions'

export default connect(
  state => {
    return {
      loggedIn: state.users.loggedIn,
      tools: state.tools,
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode,
      focus: state.app.windowFocus,
      world: state.worlds.current
    }
  },
  dispatch => {
    return {
      login: (user, pass, email, data) => {
            dispatch(login(user, pass, email, data))
      },
      getMessage: (message, from) => {
          dispatch(getMessage(message, from))
      },
      toggleMenu: (force) => {
          dispatch(toggleMenu(force))
      },
      fetchWorlds: () => {
          dispatch(fetchWorlds())
      },
      setCurrentWorld: (world) => {
        dispatch(setCurrentWorld(world))
      },
      setWindowFocus: (t) => {
        dispatch(setWindowFocus(t))
      }
    }
  }
)(App)
