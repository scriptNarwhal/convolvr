import React, { Component } from 'react';
import Button from './button';
import { isMobile } from '../../config'

let styles = {
  tab: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: '15px',
    display: 'inline-block',
    height: '60px',
    width: '60px'
  },
  title: () => {
    return {
      transition: "all 0.3s linear",
      height: 0,
      opacity: 0,
      position: 'relative',
      top: isMobile() ? '0px' : '-15px'
    }
  },
  visible: {
    opacity: 1,
    height: '20px'
  }
}

export default class Tab extends Component {

  render() {

    return (
        <div style={ Object.assign({}, styles.tab, this.props.style) } title={ this.props.title }
             onClick={ (evt) => { this.props.clickHandler(evt, this.props.title) } }
        >
            <Button title={this.props.title}
                    innerStyle={ this.props.buttonStyle }
                    image={this.props.image}
            />
            <span style={ this.props.showTitle ? Object.assign({}, styles.title(), styles.visible) : styles.title() }>
                { this.props.title }
            </span>
        </div>
    )
    
  }

}

Tab.defaultProps = {
    title: "Menu Item",
    showTitle: false, 
}
