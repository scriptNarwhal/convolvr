import React, { Component } from 'react';
import {
    fetchPlatforms,
    homePlatformInit,
    initTestPlatforms
} from '../redux/actions/platform-actions'
import { fetchUsers } from '../redux/actions/user-actions'

class App extends Component {

  componentDidMount () {
      //this.props.initHomePlatform();
      //this.props.initTestPlatforms();
  }

  render() {
    var content = "";
    if (window.location.href.split("host/").length > 1) {
    	//content = <SignIn />;
    }

    return (
        <div className="root">
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

export default connect(
  state => {
    return {
      platforms: state.platforms,
      tracks: state.tracks,
      tools: state.tools,
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
        initHomePlatform: () => {
            dispatch(homePlatformInit())
        },
        initTestPlatforms: () => {
            dispatch(initTestPlatforms())
        }
    }
  }
)(App)
