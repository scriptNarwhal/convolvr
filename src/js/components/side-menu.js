import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Tab from './tab'

class SideMenu extends Component {

  toggleMenu () {
      this.props.toggleMenu();
  }

  toggleVRMode () {
      this.props.toggleVRMode();
  }

  render() {
    return (
        <div className="side-menu" >
            <Tab image="data/x.png"
                 title="Close Menu"
                 onClick={ ()=> { browserHistory.push("/") } }
            />
            <Tab image="data/square-a.png"
                 title="Home"
                 onClick={ ()=> { browserHistory.push("/home") } }
            />
            <Tab image="data/circle-a.png"
                 title="Switch Worlds"
                 onClick={ ()=> { browserHistory.push("/worlds") } }
            />
            <Tab image="data/voxel-white.png"
                 title="Inventory"
                 onClick={ ()=> { browserHistory.push("/memory") } }
            />
            <Tab image="data/chat.png"
                 title="Chat"
                 onClick={ ()=> { browserHistory.push("/chat") } }
            />
            <Tab image="data/stack.png"
                 title="Editor"
                 onClick={ ()=> { browserHistory.push("/editor") } }
            />
            <Tab image="data/configure.png"
                 title="Settings"
                 onClick={ ()=> { browserHistory.push("/settings") } }
            />
            <Tab image="data/vr.png"
                 title="Enter VR"
                 onClick={ ()=> {this.toggleVRMode()} }
            />
        </div>
    )
  }
}

SideMenu.defaultProps = {

}

import { connect } from 'react-redux';
import {
    toggleMenu,
    toggleVR
} from '../redux/actions/app-actions'

export default connect(
  (state, ownProps) => {
    return {
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen
    }
  },
  dispatch => {
    return {
      toggleMenu: () => {
        dispatch(toggleMenu())
      },
      toggleVRMode: () => {
        dispatch(toggleVR())
      }
    }
  }
)(SideMenu)
