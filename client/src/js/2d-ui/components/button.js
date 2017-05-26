/* button */
import React, { Component } from 'react';
let styles = {
  button: {
    display: 'inline-block',
    width: '60px',
    height: '60px'
  },
  inner: {
    transition: 'all 0.2s linear',
    width: '60px',
    height: '60px',
    display: 'block',
    backgroundSize: '60%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50%',
    cursor: 'pointer'
  }
}
export default class Button extends Component {
  render() {
      let innerStyle = this.props.innerStyle != false ? Object.assign({}, styles.inner, this.props.innerStyle) : styles.inner,
          style = this.props.style != false ? Object.assign({}, styles.button, this.props.style) : styles.button
      innerStyle.backgroundImage = 'url('+(this.props.image != null ? this.props.image : "")+')';

    return (
        <div style={style}>
            <div style={innerStyle}
                title={this.props.title }
                 onClick={ (evt) => {
                   this.props.onClick && this.props.onClick(evt, this.props.title)
                 } }
            >
            </div>
        </div>
    )
  }
}

Button.defaultProps = {
    title: "Button",
    style: false
}