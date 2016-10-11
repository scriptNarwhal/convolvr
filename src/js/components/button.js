/* button */
import React, { Component } from 'react';
export default class Button extends Component {
  render() {
      let style = this.props.style;
      style.backgroundImage = 'url('+(this.props.image != null ? this.props.image : "")+')';

    return (
        <div className="button">
            <div className="inner"
                title={this.props.title }
                 onClick={ (evt) => { this.props.onClick(evt, this.props.title) } }
                 style={style}>

            </div>
        </div>
    )
  }
}

Button.defaultProps = {
    title: "Button",
    style: {}
}
