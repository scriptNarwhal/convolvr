/* General shell / dashboard UI */
import React, { Component } from 'react';
import SideMenu from './side-menu';

class Shell extends Component {
  render() {
    return (
        <div className="shell" style={{display: (this.props.menuOpen ? "block" : "none")}}>
            <div className="tabs">
                <SideMenu />
            </div>
            <div className="inner">
                {this.props.children}
            </div>
        </div>
    )
  }
}

Shell.defaultProps = {

}


import { connect } from 'react-redux'
import { toggleMenu, toggleVR } from '../redux/actions/app-actions'

export default connect(
  state => {
    return {
      platforms: state.platforms,
      tracks: state.tracks,
      tools: state.tools,
      users: state.users,
      stereoMode: state.app.vrMode
    }
  },
  dispatch => {
    return {

    }
  }
)(Shell)
