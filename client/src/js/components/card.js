import React, { Component } from 'react';
import Button from './button';

let styles = {
  worldCard: (image) => {
    return {
      cursor: "pointer",
      width: "auto",
      height: "3em",
      display: "inline-block",
      paddingLeft: '54px',
      paddingRight: '26px',
      paddingTop: "0.75em",
      marginRight: "0.25em",
      backgroundSize: "48px",
      backgroundRepeat: "no-repeat",
      backgroundImage: `url(${image})`,
      backgroundColor: "#252525",
      backgroundPositionY: "0.25em",
      backgroundPositionX: "0.25em",
      borderBottom: "#141414 solid 0.25em",
      textAlign: "center"
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
