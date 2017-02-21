import React, { Component } from 'react'
import Button from './button'

let styles = {
  bar: () => {
    return {
      cursor: 'pointer',
      width: '100%',
      left: '0',
      top: '0',
      position: 'fixed',
      paddingLeft: '74px',
      height: '48px',
      display: 'inline-block',
      marginRight: '0.5em',
      marginBottom: '0.5em'
    }
  },
  title: {
    width: '100%',
    height: '40px',
    display: 'block',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
}

export default class LocationBar extends Component {
  componentWillMount () {
    this.setState({

    })
  }
  render() {
    return (
        <div style={styles.bar()}>
            {
              this.props.path.map((opt, i) =>{
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

LocationBar.defaultProps = {
    path: []
}
