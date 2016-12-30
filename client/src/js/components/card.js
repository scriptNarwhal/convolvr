import React, { Component } from 'react';
import Button from './button';

let styles = {
  worldCard: (image) => {
    return {
      width: "6em",
      height: "3em",
      display: "inline-block",
      paddingLeft: "36px",
      paddingTop: "0.5em",
      marginLeft: "1em",
      backgroundSize: "48px",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${image})`
    }
  }
}

export default class Card extends Component {
  render() {
    return (
        <div style={styles.worldCard(this.props.image)} title={this.props.title }
             onClick={ (evt) => { this.props.clickHandler(evt, this.props.title) } }
        >
            {(this.props.showTitle ? (
                <span>
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
    image: "/data/circle-a.png"
}
