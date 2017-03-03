import React, { Component } from 'react'
import Button from './button'
import ContextMenu from './context-menu'

let styles = {
  card: (image, color, compact, quarterSize) => {
    return {
      cursor: 'pointer',
      width: quarterSize ? '120px' : '240px',
      height: quarterSize ? '120px' : (compact ? '60px' : '240px'),
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
  title: (image, quarterSize) => {
    return {
      width: '100%',
      fontSize: quarterSize ? '12px' : '16px',
      textShadow: quarterSize || image != '' ? 'rgba(0, 0, 0, 0.33) 1px 1px 1px' : 'none',
      height: '32px',
      paddingTop: '8px',
      display: 'block',
      wordBreak: 'break-word',
      backgroundColor: quarterSize || image != '' ? 'transparent' : 'rgba(0,0,0,0.2)'
    }
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
        <div style={styles.card(this.props.image, this.props.color, this.props.compact, this.props.quarterSize)}
             onClick={ (evt) => { this.props.clickHandler(evt, this.props.title) } }
             title={this.props.title }
        >
            {(this.props.showTitle ? (
                <span style={styles.title(this.props.image, this.props.quarterSize)}>
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
    image: "",
    compact: false,
    quarterSize: false,
    hasContextMenu: false
}
