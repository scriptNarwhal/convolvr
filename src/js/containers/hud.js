import React, { Component } from 'react';
import Button from '../components/button';
import { browserHistory } from 'react-router';

class HUD extends Component {

    toggleMenu () {
        this.props.toggleMenu();
    }

  render() {
    return (
        <div className="hud">
            <Button title="Options"
                    image="data/circle-a.png"
                    className="options-button"
                    onClick={ (evt, title) => {
                        //this.toggleMenu()
                        browserHistory.push("/home")
                    } }
            />
            {this.props.vrMode ? (
              <Button title="Exit VR"
                      style={{
                        position: "fixed",
                        right: 0,
                        top: 0
                      }}
                      image="data/x.png"
                      onClick={ (evt, title) => {
                          //this.toggleMenu()
                          this.props.toggleVRMode();
                      } }
              />
            ) : ""}
            <div className="crosshair">
                <div className="inner"></div>
            </div>
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
        vrMode: state.app.vrMode
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
)(HUD)
