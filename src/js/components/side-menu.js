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
            <Tab image="data/circle-a.png"
                      title="Close Menu"
                      onClick={ ()=> { browserHistory.push("/") } }
            />
            <Tab image="data/square-a.png"
                      title="Browse Channels"
                      onClick={ ()=> {alert("not implemented")} }
            />
            <Tab image="data/voxel-white.png"
                      title="Memory"
                      onClick={ ()=> { browserHistory.push("/memory") } }
            />
            <Tab image="data/stack.png"
                      title="Editor"
                      onClick={ ()=> { browserHistory.push("/editor") } }
            />
            <Tab image="data/glasses.png"
                      title="Virtual Reality Mode"
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
