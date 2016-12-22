import React, { Component } from 'react';
import { fetchUsers } from '../redux/actions/user-actions'
import Shell from '../components/shell';

class App extends Component {

  componentDidMount () {
    this.props.fetchWorlds()
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
import { fetchWorlds } from '../redux/actions/world-actions'

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
    }
  }
)(App)
