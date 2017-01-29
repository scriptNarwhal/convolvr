import React, { Component } from 'react';
import Button from '../components/button';
import { browserHistory } from 'react-router';

class HUD extends Component {

    toggleMenu () {
        this.props.toggleMenu(true);
    }

  render() {
    return (
        <div className="hud">
            {this.props.fullscreen == false ? (
            <Button title="Options"
                    image="/images/configure.png"
                    className="options-button"
                    style={{display: this.props.menuOpen ? "none" : "inline-block", backgroundColor: 'transparent'}}
                    onClick={ (evt, title) => {
                        this.toggleMenu()
                        //browserHistory.push("/menu")
                    } }
            />
            ) : ""}
            
          </div>
    )
  }
}

HUD.defaultProps = {

}

import { connect } from 'react-redux';
import {
    toggleMenu,
    toggleVR
 } from '../redux/actions/app-actions'

export default connect(
  (state, ownProps) => {
    return {
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode,
        fullscreen: state.app.fullscreen
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
)(HUD)
