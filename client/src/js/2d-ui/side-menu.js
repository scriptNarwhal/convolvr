import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Tab from './tab'

const styles = {
  sideMenu: {
    width: '10vh',
    maxWidth: '98px',
    height: '10vh',
    backgroundColor: 'rgb(19, 19, 19)'
  },
  inner: {
    height: '100%',
    bottom: 0,
    maxWidth: '96px'
  }
}

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
        <div style={styles.sideMenu} >
          <div style={styles.inner}>
            <Tab image="/images/plus.png"
                 title="Create New World"
                 clickHandler={ ()=> { browserHistory.push("/worlds/new") } }
            />
            <Tab image="/images/circle-a.png"
                 title="Switch Worlds"
                 clickHandler={ ()=> { browserHistory.push("/worlds") }}
            />
            <Tab image="/images/chat.png"
                 title="Chat"
                 clickHandler={ ()=> { browserHistory.push("/chat") } }
            />
            <Tab image="/images/logout.png"
                 title="Sign In / Switch Accounts"
                 clickHandler={ ()=> { browserHistory.push("/login") } }
            />
            <Tab image="/images/configure.png"
                 title="Settings"
                 clickHandler={ ()=> { browserHistory.push("/settings") } }
            />
            <Tab image="/images/x.png"
                  title="Close Menu"
                  clickHandler={() => {
                    this.toggleMenu()
                    this.goBack()
                  }}
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
