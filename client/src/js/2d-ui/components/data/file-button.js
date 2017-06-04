import React, { Component } from 'react'

let styles = {
  button: {
    height: '32px',
    display: 'inline-block',
    paddingLeft: '0.5em',
    paddingRight: '0.5em',
    marginLeft: '0.5em',
    background: 'rgba(255, 255, 255, 0.15)',
    textAlign: "center",
    borderRadius: '1.5px',
    borderLeft: '0.2em solid lime',
    boxShadow: '0 0.25em 0.5em 0px rgba(0, 0, 0, 0.3)'
  }
}

export default class FileButton extends Component {

  render() {
    
    return (
        <div style={ Object.assign({}, styles.button, this.props.style) } 
             onClick={ (evt) => {
                this.props.onClick && this.props.onClick(evt, this.props.title)
             }}
             title={ this.props.title } 
        >
           { this.props.title }
        </div>
    )
  }

}

FileButton.defaultProps = {
    title: "Button",
    style: {}
}
