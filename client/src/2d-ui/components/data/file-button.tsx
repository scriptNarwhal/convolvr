import * as React from "react"; import { Component } from "react";
import { fileButtonStyle } from '../../styles'

let styles = {
  button: fileButtonStyle
}

export default class FileButton extends Component<any, any> {

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
