import * as React from "react";
import { Component } from "react";
import Button from '../components/button'
import { withRouter } from 'react-router-dom'

const styles = {
    optionButton: {
        float: "left"
    }
}

class HUD extends Component<any, any> {

    private props: any;
    private state: any;

    toggleMenu (force) {
        this.props.toggleMenu(force);
    }

  componentDidMount( ) {

  }

  render() {
    return (
        <div className="hud">
            {this.props.fullscreen == false ? (<Button title="Options"
                    image="/data/images/configure-h.png"
                    style={ Object.assign({}, styles.optionButton, {display: this.props.menuOpen ? "none" : "inline-block", backgroundColor: 'transparent'}) }
                    onClick={ (evt, title) => {
                        this.toggleMenu(true)
                        //browserHistory.push("/menu")
                    } }
            />) : ""}
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
 } from '../../redux/actions/app-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode,
        fullscreen: state.app.fullscreen
    }
  },
  (dispatch: Function) => {
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
