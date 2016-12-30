import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { events } from '../network/socket'
import { fetchUsers } from '../redux/actions/user-actions'
import Shell from '../components/shell';

class App extends Component {

  componentDidMount () {
    this.props.fetchWorlds()
    events.on("chat message", message => {
    	this.props.getMessage(message.data)
    })
    this.props.setCurrentWorld(window.worldName)
    window.document.body.addEventListener("keydown", (e)=>this.handleKeyDown(e), true)
    if (window.location.href.indexOf("/chat") > -1) {
      this.props.toggleMenu(true);
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
  render() {
    var content = "";
    if (window.location.href.split("host/").length > 1) {
    	//content = <SignIn />;
    }

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

export default connect(
  state => {
    return {
      tools: state.tools,
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      fetchWorlds: () => {
          dispatch(fetchWorlds())
      },
      getMessage: (message) => {
          dispatch(getMessage(message))
      },
      toggleMenu: (force) => {
          dispatch(toggleMenu(force))
      },
      setCurrentWorld: (world) => {
        dispatch(setCurrentWorld(world))
      }
    }
  }
)(App)
