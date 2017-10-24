import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'

class ImportToInventory extends Component {

  constructor () {

    super()

  }

  componentWillMount () {

    this.setState({
      activated: false,
      editMode: false,
      text: "",
      name: "",
      data: {},
      id: 0
    })

    
  }

  componentWillReceiveProps ( nextProps ) {

    if ( this.props.sharesFetching && nextProps.sharesFetching == false && !!nextProps.readText ) {

      this.setState({
        text: nextProps.readText
      })

    }

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

  save ( id ) {

    let name = this.state.name,
        data = {}

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
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Import To Inventory</span> 

                <input type="text" onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } /> 
                
              </span>
            </div>
            <div style={ styles.body }>
              <textarea style={ styles.textArea } onBlur={ e=> this.handleTextArea(e) } />
              <FileButton title="Save" onClick={ () => { this.save() } } />
              <FileButton title="Close" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
            </div>
          </div>
        </div>
      )

    } else {

      return (
        <FileButton title="Import To Inventory" onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
}

ImportToInventory.defaultProps = {

}

import { connect } from 'react-redux'
import {
    toggleMenu
} from '../../../redux/actions/app-actions'
import {
  readText,
  writeText
} from '../../../redux/actions/file-actions'
import {
    closeImportToInventory
} from '../../../redux/actions/util-actions'
  
export default connect(
  (state, ownProps) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.importToInventory.activated,
        filename: state.util.importToInventory.filename,
        fileUser: state.util.importToInventory.username,
        dir: state.util.importToInventory.dir
    }
  },
  dispatch => {
    return {
      closeImportToInventory: () => {
        dispatch( closeImportToInventory() )
      }
    }
  }
)(ImportToInventory)



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
    width: '95%',
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