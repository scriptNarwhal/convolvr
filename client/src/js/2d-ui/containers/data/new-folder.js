/* implement this */
import React, { Component } from 'react';
import Button from '../button';
import { browserHistory } from 'react-router';

class NewFolder extends Component {

    toggleMenu (force) {
        this.props.toggleMenu(force);
    }

  render() {
    return (
        <div className="hud">

        </div>
    )
  }
}

NewFolder.defaultProps = {

}

import { connect } from 'react-redux';
import {
    toggleMenu,
    toggleVR
 } from '../../redux/actions/app-actions'

export default connect(
  (state, ownProps) => {
    return {
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode
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
)(NewFolder)
