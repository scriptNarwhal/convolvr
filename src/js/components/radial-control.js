/* button */
import React, { Component } from 'react';
export default class RadialControl extends Component {
  render() {
      let style = this.props.style;

    return (
        <div className="radial-control">
            <div className="inner"
                title={this.props.title }
                 onClick={ (evt) => { this.props.onClick(evt, this.props.title) } }
                 style={style}
            >

            </div>
        </div>
    )
  }
}

RadialControl.defaultProps = {
    title: "RadialControl",
    style: {}
}
