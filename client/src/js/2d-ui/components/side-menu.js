import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Tab from './tab'
import { isMobile } from '../../config'

class SideMenu extends Component {

  componentWillMount () {

    this.setState({
      menuHover: false
    })

  }

  toggleMenu ( force ) {

      this.props.toggleMenu(force)

  }

  toggleVRMode () {

      this.props.toggleVRMode()

  }

  navigate ( evt, url ) {
    
    browserHistory.push( url )

  }

  onMouseOver ( evt ) {

    this.setState({
      menuHover: true
    })

  }

  onMouseOut ( evt ) {

    this.setState({
      menuHover: false
    })

  }

  render() {

    return (
        <div style={styles.sideMenu()} >
          <div style={styles.inner()} onMouseOver={ e=> this.onMouseOver(e) } onMouseOut={ e=> this.onMouseOut(e) }>
            <Tab clickHandler={ e => { this.toggleMenu(); this.navigate(e, "");  } }
                 image="/data/images/convolvr2.png"
                 buttonStyle={{ backgroundSize: "100%" }}
                 showTitle={ false }
                 title="Home"
            /> 
            <Tab clickHandler={ e => { this.navigate(e, "/worlds") }}
                 image="/data/images/circle-a.png"
                 showTitle={ this.state.menuHover }
                 title="Worlds"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/places") }}
                 showTitle={ this.state.menuHover }
                 image="/data/images/places-s.png"
                 style={ styles.mobileHidden() }
                 title="Places"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/new-world") } }
                 showTitle={ this.state.menuHover }
                 image="/data/images/plus.png"
                 title="New"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/chat") } }
                 showTitle={ this.state.menuHover }
                 image="/data/images/chat.png"
                 title="Chat"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/profile") } }
                 showTitle={ this.state.menuHover }
                 image="/data/images/profile.png"
                 style={ styles.mobileHidden() }
                 title="Profile"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/inventory") } }
                 style={ styles.mobileHidden() }
                 showTitle={ this.state.menuHover }
                 image="/data/images/entities.png"
                 title="Inventory"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/files") }}
                 showTitle={ this.state.menuHover }
                 image="/data/images/voxel-white.png"
                 title="Data"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/network") }}
                 showTitle={ this.state.menuHover }
                 image="/data/images/network.png"
                 style={ styles.mobileHidden() }
                 title="Network"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/login") } }
                 showTitle={ this.state.menuHover }
                 title="Sign In"
                 style={ styles.mobileHidden() }
                 image="/data/images/logout.png"
            />
            <Tab clickHandler={ e => { this.navigate(e, "/settings") } }
                 image="/data/images/configure-h.png"
                 showTitle={ this.state.menuHover }
                 title="Settings"
                 
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