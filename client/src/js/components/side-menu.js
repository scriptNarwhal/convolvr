import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Tab from './tab'

class SideMenu extends Component {

  toggleMenu () {
      this.props.toggleMenu()
  }

  goBack () {
    browserHistory.push(`/world/${this.props.world}`)
  }

  toggleVRMode () {
      this.props.toggleVRMode()
  }


  render() {
    return (
        <div className="side-menu" >
            <Tab image="/data/x.png"
                  title="Close Menu"
                  clickHandler={() => {
                    this.toggleMenu()
                    this.goBack()
                  }}
            />
            <Tab image="/data/circle-a.png"
                 title="Switch Worlds"
                 clickHandler={ ()=> { browserHistory.push("/worlds") }}
            />
            {/* <Tab image="/data/voxel-white.png"
                 title="Inventory"
                 clickHandler={ ()=> { browserHistory.push("/memory") } }
            /> */}
            {/* <Tab image="/data/stack.png"
                 title="Editor"
                 clickHandler={ ()=> { browserHistory.push("/editor") } }
            /> */}
            <Tab image="/data/chat.png"
                 title="Chat"
                 clickHandler={ ()=> { browserHistory.push("/chat") } }
            />
            <Tab image="/data/vr.png"
                 title="Enter VR"
                 clickHandler={ (e)=> {
                   this.toggleVRMode()
                   browserHistory.push("/")
                 } }
            />
            <Tab image="/data/configure.png"
                 title="Settings"
                 clickHandler={ ()=> { /*browserHistory.push("/settings")*/ alert("Not Implemented") } }
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
        world: state.worlds.current,
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
