import React, { Component } from 'react'
import Button from './button'

let styles = {
  card: (color, compact) => {
    return {
      cursor: 'pointer',
      width: '240px',
      height: compact ? '60px' : '240px',
      display: 'inline-block',
      marginRight: '0.5em',
      marginBottom: '0.5em',
      backgroundColor: 'rgb(50, 50, 50)',
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

export default class ContextMenu extends Component {
  componentWillMount () {
    this.setState({

    })
  }
  render() {
    return (
        <div style={styles.card(this.props.color, this.props.compact)} title={this.props.title }
             onClick={ (evt) => { this.props.clickHandler(evt, this.props.title) } }
        >
            {(this.props.showTitle ? (
                <span style={styles.title}>
                { this.props.title }
                </span>
            ) : "")}
            {
              this.options.map((opt, i) =>{
                return (
                  <div style={styles.option}
                       key={i}
                  >
                    { opt }
                  </div>
                )
              })
            }
        </div>
    )
  }
}

ContextMenu.defaultProps = {
    title: "File Options",
    showTitle: false,
    color: '#252525',
    compact: false,
    options: []
}
