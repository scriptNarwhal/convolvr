import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'

let rgb = ( r, g, b ) => { // because I never remeber to quote that rofl..
    return `rgb(${r}, ${g}, ${b})`
  },
  rgba = ( r, g, b, a ) => { // because I never remeber to quote that rofl..
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

let styles = {
  modal: {
    width: '50%',
    maxWidth: '729px',
    minWidth: '320px',
    height: '480px',
    padding: '0.25em',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    background: rgb(38, 38, 38),
    borderTop: '0.2em solid'+ rgba(255, 255, 255, 0.06)
  },
  lightbox: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: rgba(0, 0, 0, 0.8)
  },
  resultingPath: {
    marginBottom: '1em'
  },
  cancelButton: {
    borderLeft: 'solid 0.2em magenta'
  },
  header: {
    width: '100%',
    marginTop: '0.5em',
    marginBotto: '0.5em'
  },
  text: {
    width: '75%',
    padding: '0.25em',
    marginBottom: '0.5em',
    background: '#212121',
    border: 'solid 0.1em'+ rgba(255, 255, 255, 0.19),
    borderRadius: '2px',
    fontSize: '1em',
    color: 'white',
  },
  textArea: {
    margin: '0px',
    width: '580px',
    height: '358px',
    color: 'white',
    marginBottom: '0.5em',
    padding: '0.5em',
    background: 'black'
  },
  body: {

  },
  title: {

  }
}


class TextEditor extends Component {

  constructor () {

    this.state = {
      activated: false
    }

  }

  componentWillMount () {

    this.setState({
      activated: false
    })
    
  }

  componentWillReceiveProps ( nextProps ) {

  }

  componentWillUpdate ( nextProps, nextState ) {

  }

  handleTextChange (e) {

    this.setState({
      name: e.target.value
    })

  }

  handleTextArea (e) {

    this.setState({
      text: e.target.value
    })

  }

  save () {

    let name = this.state.name

    if ( name != "" ) {

      this.toggleModal()

    } else {

      alert("Name is required.")

    }

  }

  toggleModal () {

    this.setState({
      activated: !this.state.activated
    })

  }

  render() {

    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox }>
          <div style={ styles.modal } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Editing</span> 
                <input type="text" onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } /> 
              </span>
            </div>
            <div style={ styles.body }>
              <textarea style={ styles.textArea } onBlur={ e=> this.handleTextArea(e) } />
              <FileButton title="Save" onClick={ () => { this.save() } } />
              <FileButton title="Cancel" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
            </div>
          </div>
        </div>
      )

    } else {

      return (
        <FileButton title="New File" onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
}

TextEditor.defaultProps = {

}

import { connect } from 'react-redux'
import {
    toggleMenu
} from '../../../redux/actions/app-actions'
import {
  readText,
  writeText
} from '../../../redux/actions/file-actions'

export default connect(
  (state, ownProps) => {
    return {
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      readText: (filename, username, dir) => {
        dispatch( readText (filename, username, dir) )
      },
      writeText: (text, filename, username, dir) => {
        dispatch ( writeText (text, filename, username, dir) )
      },
      toggleMenu: (force) => {
          dispatch(toggleMenu(force))
      }
    }
  }
)(TextEditor)
