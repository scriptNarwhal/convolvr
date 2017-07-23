import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Tab from './tab'

let isMobile = () => {
    return  window.innerWidth <= 720
  }

let styles = {
    sideMenu: () => {
      let mobile = isMobile()
      return {
        width: mobile ? '100vw' : '72px',
        //maxWidth: mobile ? '100vw' : '72px',
        height: mobile ? '72px' : '100vh',
        backgroundColor: 'rgb(2, 0, 3)',
        overflow: 'hidden'
      }
    },
    inner: () => {
      let mobile = isMobile()
      return {
        height: mobile ? '72px' : '100vh',
        bottom: 0,
        width: mobile ? '100vw' : '72px',
        paddingTop: '7px'
      }
    },
    mobileHidden: () => {
      let mobile = isMobile()
      return {
        display: mobile ? 'none' : 'inline-block'
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
    
    browserHistory.push( `${url}` )

  }

  render() {
    return (
        <div style={styles.sideMenu()} >
          <div style={styles.inner()}>
            <Tab image="/data/images/convolvr2.png"
                 title="Home"
                 buttonStyle={{ backgroundSize: "100%" }}
                 clickHandler={ e => { this.toggleMenu(); this.navigate(e, "");  } }
            /> 
            <Tab image="/data/images/circle-a.png"
                 title="Switch Worlds"
                 clickHandler={ e => { this.navigate(e, "/worlds") }}
            />
            <Tab clickHandler={ e => { this.navigate(e, "/places") }}
                 image="/data/images/places-s.png"
                 style={ styles.mobileHidden() }
                 title="Places"
            />
            <Tab image="/data/images/plus.png"
                 title="Create New World"
                 clickHandler={ e => { this.navigate(e, "/new-world") } }
            />
            <Tab image="/data/images/chat.png"
                 title="Chat"
                 clickHandler={ e => { this.navigate(e, "/chat") } }
            />
            <Tab image="/data/images/profile.png"
                 title="Chat"
                 clickHandler={ e => { this.navigate(e, "/profile") } }
            />
            <Tab image="/data/images/voxel-white.png"
                 title="Manage Files"
                 clickHandler={ e => { this.navigate(e, "/files") }}
            />
            <Tab clickHandler={ e => { this.navigate(e, "/network") }}
                 image="/data/images/network.png"
                 style={ styles.mobileHidden() }
                 title="View Network"
            />
            <Tab image="/data/images/logout.png"
                 title="Sign In / Switch Accounts"
                 style={ styles.mobileHidden() }
                 clickHandler={ e => { this.navigate(e, "/login") } }
            />
            <Tab image="/data/images/obj.png"
                 title="Import *.OBJ Files"
                 style={ styles.mobileHidden() }
                 clickHandler={ e => { this.navigate(e, "/import") } }
            />
            <Tab image="/data/images/configure-h.png"
                 title="Settings"
                 clickHandler={ e => { this.navigate(e, "/settings") } }
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
} from '../../redux/actions/app-actions'

export default connect(
  (state, ownProps) => {
    return {
        world: state.worlds.current,
        worldUser: state.worlds.worldUser,
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
