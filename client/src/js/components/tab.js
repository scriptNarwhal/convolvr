import React, { Component } from 'react';
import Button from './button';

const styles = {
  tab: {
    height: '8vh',
    color: 'rgba(255,255,255,0.92)',
    width: '7.5vh',
    fontSize: '15px',
    display: 'inline-block',
    marginTop: '0.5vh',
    maxHeight: '72px',
    maxWidth: '72px',
  }
}

export default class Tab extends Component {
  render() {
    return (
        <div style={styles.tab} title={this.props.title }
             onClick={ (evt) => { this.props.clickHandler(evt, this.props.title) } }
        >
            {(this.props.showTitle ? (
                <span>
                { this.props.title }
                </span>
            ) : "")}
            <Button title={this.props.title}
                    image={this.props.image}
            />
        </div>
    )
  }
}

Tab.defaultProps = {
    title: "Menu Item",
    showTitle: false
}
