import React, { Component } from 'react';
import Button from './button';

let styles = {
  card: (image, color, compact) => {
    return {
      cursor: 'pointer',
      width: '240px',
      height: compact ? '60px' : '240px',
      display: 'inline-block',
      marginRight: '0.5em',
      marginBottom: '0.5em',
      backgroundColor: 'rgb(50, 50, 50)',
      backgroundSize: 'cover',
      backgroundImage: `url(${image})`,
      textAlign: "center",
      borderRadius: '1.5px',
      boxShadow: '0 0.25em 0.5em 0px rgba(0, 0, 0, 0.3)'
    }
  },
  title: {
    width: '100%',
    height: '40px',
    display: 'block',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
}

export default class Card extends Component {
  render() {
    return (
        <div style={styles.card(this.props.image, this.props.color)} title={this.props.title }
             onClick={ (evt) => { this.props.clickHandler(evt, this.props.title) } }
        >
            {(this.props.showTitle ? (
                <span style={styles.title}>
                { this.props.title }
                </span>
            ) : "")}
        </div>
    )
  }
}

Card.defaultProps = {
    title: "Menu Item",
    showTitle: false,
    color: '#252525',
    image: "/images/circle-a.png",
    compact: false
}
