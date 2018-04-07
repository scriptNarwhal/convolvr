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

    public props: any;
    public state: any;

    toggleMenu (force: boolean) {
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
                    onClick={ (evt: any, title: string) => {
                        this.toggleMenu(true)
                        //this.props.history.push("/menu")
                    } }
            />) : ""}
          </div>
    )
  }
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
      toggleMenu: (force: boolean) => {
          dispatch(toggleMenu(force))
      },
      toggleVRMode: () => {
          dispatch(toggleVR())
      }
    }
  }
)(HUD)
