/* General shell / dashboard UI */
import React, { Component } from 'react'
import SideMenu from './side-menu'
import { browserHistory } from 'react-router'

let styles = {
  shell: (hasMenu, menuOpen, menuOnly, noBackground) => {
    let mobile = window.innerWidth <= 640
    console.log("mobile", mobile)
    return {
      margin: 'auto',
      position: 'fixed',
      top: 0,
      left: 0,
      textAlign: 'center',
      width: (menuOnly && !mobile ? '72px' : '100%'),
      height: mobile ? '72px' : '100vh',
      borderRadius: '0.8vh',
      display: (menuOpen  ? "block" : "none"),
      zIndex: (hasMenu ? 999999 : 1),
      cursor: 'pointer',
      height: '100vh',
      backgroundImage: noBackground ? 'none' : 'linear-gradient(to bottom, #0c0c0c, #111111, #212121)',
      overflowY: 'auto',
      overflowX: 'hidden',
      paddingRight: '20px' //scrollbars are ugly (minimap would be nicer)
    }
  },
  inner: {
    paddingTop: '48px',
    paddingLeft: '72px'
  }
}

class Shell extends Component {
  render() {
    let hasMenu = !!this.props.hasMenu,
        menuOnly = !!this.props.menuOnly,
        menuOpen = this.props.menuOpen,
        noBackground = this.props.noBackground
    return (
        <div style={styles.shell(hasMenu, menuOpen, menuOnly, noBackground)}
             onDrop={this.props.onDrop}
             onDragEnter={this.props.onDragEnter}
             onDragOver={this.props.onDragOver}
             onDragLeave={this.props.onDragLeave}
            //  onFileDragHover={this.props.onFileDragHover}
          onClick={e=> {
            if (e.target.getAttribute('id') == 'shell') {
              this.props.toggleMenu()
            }
          }}
          className='shell'
          id='shell'
        >
            {hasMenu ? (
              <SideMenu />
            ) : ''}
            {menuOnly ? '' : (
              <div style={styles.inner}>
                  {this.props.children}
              </div>
            )}
        </div>
    )
  }
}

Shell.defaultProps = {
  noBackground: false
}


import { connect } from 'react-redux'
import { toggleMenu, toggleVR } from '../redux/actions/app-actions'

export default connect(
  state => {
    return {
      menuOpen: state.app.menuOpen,
      platforms: state.platforms,
      tracks: state.tracks,
      tools: state.tools,
      users: state.users,
      stereoMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      toggleMenu: () => {
        dispatch(toggleMenu())
      },
    }
  }
)(Shell)
