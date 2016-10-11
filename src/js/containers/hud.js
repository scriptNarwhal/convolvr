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
                    onClick={ (evt, title) => {
                        //this.toggleMenu()
                        browserHistory.push("/channels")
                    } }
            />
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
    toggleMenu
 } from '../redux/actions/app-actions'

export default connect(
  (state, ownProps) => {
    return {
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen
    }
  },
  dispatch => {
    return {
      toggleMenu: () => {
        dispatch(toggleMenu())
    }
    }
  }
)(HUD)
