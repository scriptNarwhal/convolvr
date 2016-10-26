import React, { Component } from 'react';
import Button from './button';

export default class Tab extends Component {
  render() {
    return (
        <div className="tab" title={this.props.title }
             onClick={ (evt) => { this.props.onClick(evt, this.props.title) } }
        >
            {(this.props.showTitle ? (
                <span>
                { this.props.title }
                </span>
            ) : "")}
            <Button title={this.props.title}
                    onClick={(evt, title) => { this.props.onClick(evt) }}
                    image={this.props.image}
                    style={{ marginRight: "0.25em"}}
            />
        </div>
    )
  }
}

Tab.defaultProps = {
    title: "Menu Item",
    showTitle: false
}
