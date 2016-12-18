/* menu item */
import React, { Component } from 'react';
import Button from './button';

export default class MenuItem extends Component {
  render() {
    return (
        <div className="menu-item" title={this.props.title }
             onClick={ (evt) => { this.props.onClick(evt, this.props.title) } }
        >
            <span>
                { this.props.title }
            </span>
            <Button title={this.props.title}
                    onClick={(evt, title) => { this.props.onClick(evt) }}
                    image={this.props.image}
                    style={{ marginRight: "0.25em"}}
            />
        </div>
    )
  }
}

MenuItem.defaultProps = {
    title: "Menu Item"
}
