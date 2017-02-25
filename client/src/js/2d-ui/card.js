import React, { Component } from 'react'
import Button from './button'
import ContextMenu from './context-menu'

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
    fontSize: '16px',
    height: '32px',
    paddingTop: '8px',
    display: 'block',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
}

export default class Card extends Component {
  componentWillMount () {
    this.setState({
      contextMenuOptions: [
        "Open",
        "Edit",
        "Delete"
      ]
    })
  }
  render() {
    return (
        <div style={styles.card(this.props.image, this.props.color, this.props.compact)} title={this.props.title }
             onClick={ (evt) => { this.props.clickHandler(evt, this.props.title) } }
        >
            {(this.props.showTitle ? (
                <span style={styles.title}>
                { this.props.title }
                </span>
            ) : "")}
            {
              this.props.hasContextMenu ? (
                <ContextMenu options={this.state.contextMenuOptions} />
              ) : ''
            }
        </div>
    )
  }
}

Card.defaultProps = {
    title: "Menu Item",
    showTitle: false,
    color: '#252525',
    image: "/images/circle-a.png",
    compact: false,
    hasContextMenu: false
}
