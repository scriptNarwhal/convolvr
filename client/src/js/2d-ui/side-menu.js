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

  toggleMenu (force) {
      this.props.toggleMenu(force)
  }

  toggleVRMode () {
      this.props.toggleVRMode()
  }

  navigate (evt, url) {
    browserHistory.push(url)
  }

  render() {
    return (
        <div style={styles.sideMenu()} >
          <div style={styles.inner()}>
            <Tab image="/data/images/plus.png"
                 title="Create New World"
                 clickHandler={ (e)=> { this.navigate(e, "/new-world") } }
            />
            <Tab image="/data/images/circle-a.png"
                 title="Switch Worlds"
                 clickHandler={ (e)=> { this.navigate(e, "/worlds") }}
            />
            <Tab image="/data/images/square-a.png"
                 title="View Network"
                 clickHandler={ (e)=> { this.navigate(e, "/network") }}
            />
            <Tab image="/data/images/voxel-white.png"
                 title="Manage Files"
                 clickHandler={ (e)=> { this.navigate(e, "/files") }}
            />
            <Tab image="/data/images/chat.png"
                 title="Chat"
                 clickHandler={ (e)=> { this.navigate(e, "/chat") } }
            />
            <Tab image="/data/images/logout.png"
                 title="Sign In / Switch Accounts"
                 clickHandler={ (e)=> { this.navigate(e, "/login") } }
            />
            <Tab image="/data/images/configure-h.png"
                 title="Settings"
                 clickHandler={ (e)=> { this.navigate(e, "/settings") } }
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
      toggleMenu: (force) => {
        dispatch(toggleMenu(force))
      },
      toggleVRMode: () => {
        dispatch(toggleVR())
      }
    }
  }
)(SideMenu)
