import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Tab from './tab'

let styles = {
  sideMenu: () => {
    let mobile = window.innerWidth <= 640
    return {
      width: mobile ? '100vw' : '72px',
      //maxWidth: mobile ? '100vw' : '72px',
      height: mobile ? '72px' : '100vh',
      backgroundColor: 'rgb(9, 9, 9)',
      overflow: 'hidden'
    }
  },
  inner: () => {
    let mobile = window.innerWidth <= 640
    return {
      height: mobile ? '72px' : '100vh',
      bottom: 0,
      width: mobile ? '100vw' : '72px',
      paddingTop: '7px'
    }
  }
}

class SideMenu extends Component {

  toggleMenu () {
      this.props.toggleMenu()
  }

  toggleVRMode () {
      this.props.toggleVRMode()
  }

  render() {
    return (
        <div style={styles.sideMenu()} >
          <div style={styles.inner()}>
            <Tab image="/images/plus.png"
                 title="Create New World"
                 clickHandler={ ()=> { browserHistory.push("/worlds/new") } }
            />
            <Tab image="/images/circle-a.png"
                 title="Switch Worlds"
                 clickHandler={ ()=> { browserHistory.push("/worlds") }}
            />
            <Tab image="/images/square-a.png"
                 title="View Network"
                 clickHandler={ ()=> { browserHistory.push("/network") }}
            />
            <Tab image="/images/voxel-white.png"
                 title="Manage Data"
                 clickHandler={ ()=> { browserHistory.push("/data") }}
            />
            <Tab image="/images/chat.png"
                 title="Chat"
                 clickHandler={ ()=> { browserHistory.push("/chat") } }
            />
            <Tab image="/images/logout.png"
                 title="Sign In / Switch Accounts"
                 clickHandler={ ()=> { browserHistory.push("/login") } }
            />
            <Tab image="/images/configure-h.png"
                 title="Settings"
                 clickHandler={ ()=> { browserHistory.push("/settings") } }
            />
          </div>
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
