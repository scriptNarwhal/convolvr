/* General shell / dashboard UI */
import React, { Component } from 'react'
import SideMenu from './side-menu'
import { browserHistory } from 'react-router'

const styles = {
  inner: {
    top: '10vh',
    left: 0,
    position: 'relative'
  }
}

class Shell extends Component {
  render() {
    let hasMenu = !!this.props.hasMenu,
        menuOnly = !!this.props.menuOnly
    return (
        <div style={{
            display: (this.props.menuOpen  ? "block" : "none"),
            zIndex: (hasMenu ? 999999 : 1),
            cursor: 'pointer',
            height: (menuOnly ? '10vh' : '100%')
          }}
          onClick={e=> {
            if (e.target.getAttribute('id') == 'shell') {
              this.props.toggleMenu()
            }
          }}
          className='shell'
          id='shell'
        >
            {hasMenu ? (
              <div className="tabs">
                  <SideMenu />
              </div>
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
