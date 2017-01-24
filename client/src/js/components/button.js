/* button */
import React, { Component } from 'react';
let styles = {
  button: {
    display: 'inline-block',
    width: '7.5vh',
    height: '7.5vh',
    maxWidth: '72px',
    maxHeight: '72px',
    marginRight: 0,
    background: 'linear-gradient(to top, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.13))',
    borderRadius: '0.4vh',
    marginRight: '0.25em'
  },
  inner: {
    height: '100%',
    width: '100%',
    transition: 'all 0.2s linear',
    backgroundSize: 'contain',
    height: '7.5vh',
    width: '7.5vh',
    maxWidth: '72px',
    maxHeight: '72px',
    display: 'block',
    opacity: 0.9,
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
