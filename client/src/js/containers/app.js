import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { events } from '../network/socket'
import { fetchUsers } from '../redux/actions/user-actions'
import Shell from '../components/shell';

class App extends Component {

  componentDidMount () {
    this.props.fetchWorlds()
    events.on("chat message", message => {
      let chatMessage = JSON.parse(message.data)
    	this.props.getMessage(chatMessage)
      this.notify(chatMessage)
    })
    this.props.setCurrentWorld(window.worldName)
    window.document.body.addEventListener("keydown", (e)=>this.handleKeyDown(e), true)
    if (window.location.href.indexOf("/chat") > -1 || window.location.href.indexOf("/login") > -1) {
      this.props.toggleMenu(true);
    }
    // detect user credentials
    let rememberUser = localStorage.getItem("rememberUser"),
        username = '',
        password = ''
    if (rememberUser != null) {
      username = localStorage.getItem("username")
      password = localStorage.getItem("password")
      if (username != null && username != '') {
        this.props.login(username, password, "", "")
      }
    }
    if (window.location.href.indexOf("/chat") >-1 && this.props.loggedIn == false) {
      browserHistory.push("/login")
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

  notify (chatMessage) {
    function doNotification() {
      function onNotifyShow() {
          console.log('notification was shown!');
      }
      console.log("notify ", window.Notify.default)
      let Notify = window.Notify.default,
          myNotification = new Notify('New Message', {
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
import { toggleMenu } from '../redux/actions/app-actions'
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
      stereoMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      login: (user, pass, email, data) => {
            dispatch(login(user, pass, email, data))
      },
      getMessage: (message) => {
          dispatch(getMessage(message))
      },
      toggleMenu: (force) => {
          dispatch(toggleMenu(force))
      },
      fetchWorlds: () => {
          dispatch(fetchWorlds())
      },
      setCurrentWorld: (world) => {
        dispatch(setCurrentWorld(world))
      }
    }
  }
)(App)
