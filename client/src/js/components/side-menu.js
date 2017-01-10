import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Tab from './tab'

const styles = {
  sideMenu: {
    width: '10vh',
    maxWidth: '98px',
    height: '100%'
  },
  inner: {
    position: 'absolute',
    top: '0',
    paddingTop: '1vh',
    paddingTop: '6px',
    width: '10vh',
    maxWidth: '98px',
    bottom: 0,
    margin: 'auto',
    backgroundColor: 'rgb(12, 12, 12)'
  }
}

class SideMenu extends Component {

  toggleMenu () {
      this.props.toggleMenu()
  }

  goBack () {
    browserHistory.push(`/subspace/${this.props.world}`)
  }

  toggleVRMode () {
      this.props.toggleVRMode()
  }

  render() {
    return (
        <div style={styles.sideMenu} >
          <div style={styles.inner}>
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
                 title="Manage Data"
                 clickHandler={ ()=> { browserHistory.push("/memory") } }
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
            <Tab image="/data/logout.png"
                 title="Sign In / Switch Accounts"
                 clickHandler={ ()=> { browserHistory.push("/login") } }
            />
            <Tab image="/data/configure.png"
                 title="Settings"
                 clickHandler={ ()=> { /*browserHistory.push("/settings")*/ alert("Not Implemented") } }
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
