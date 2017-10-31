import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'

class TextEditor extends Component {

  constructor () {

    super()

  }

  componentWillMount () {

    this.setState({
      activated: false,
      text: "",
      name: ""
    })

    if ( !!this.props.fileURL ) {

      this.props.readText( this.props.fileURL, this.props.username, this.props.cwd.join("/") )

    }
    
  }

  componentWillReceiveProps ( nextProps ) {

    if ( this.props.readTextFetching && nextProps.readTextFetching == false && !!nextProps.textData ) {

      this.setState({
        text: nextProps.textData.text
      })

    }

    if ( this.props.filename != nextProps.filename || this.props.dir != nextProps.dir ) {

      if ( nextProps.dir != "" && nextProps.filename != "" ) {

        this.props.readText( nextProps.filename, nextProps.fileUser, nextProps.dir )
        this.setState({
          name: nextProps.filename
        })
      }

    }

    if ( this.props.activated == false && nextProps.activated == true ) {

      this.setState({
        activated: true
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

  save () {

    let name = this.state.name,
        dir = this.props.activated ? this.props.dir : this.props.cwd.join("/") 

    if ( name != "" ) {

      this.props.writeText( this.state.text, name, this.props.fileUser || this.props.username, dir )
      this.toggleModal()

    } else {

      alert("Name is required.")

    }

  }

  toggleModal () {

    this.props.closeTextEdit()
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
                <input defaultValue={ this.state.name } type="text" onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } /> 
              </span>
            </div>
            <div style={ styles.body }>
              { this.props.readTextFetching == false  ? (
                <textarea defaultValue={ this.state.text } style={ styles.textArea } onBlur={ e=> this.handleTextArea(e) } />
              ) : ""}
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
  readText,
  writeText
} from '../../../redux/actions/file-actions'
import {
  closeTextEdit
} from '../../../redux/actions/util-actions'

export default connect(
  (state, ownProps) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        textData: state.files.readText.data,
        readTextFetching: state.files.readText.fetching,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.textEdit.activated,
        filename: state.util.textEdit.filename,
        fileUser: state.util.textEdit.username,
        dir: state.util.textEdit.dir,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      readText: (filename, username, dir) => {
        dispatch( readText (filename, username, dir) )
      },
      writeText: (text, filename, username, dir) => {
        dispatch( writeText (text, filename, username, dir) )
      },
      closeTextEdit: () => {
        dispatch( closeTextEdit() )
      }
    }
  }
)(TextEditor)

let rgb = ( r, g, b ) => { // because I never remeber to quote that rofl..
  return `rgb(${r}, ${g}, ${b})`
},
rgba = ( r, g, b, a ) => { 
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
  backgroundColor: "black",
  backgroundImage: 'linear-gradient(rgb(12, 12, 12), rgb(17, 17, 17), rgb(33, 33, 33))',
  border: '0.1em solid white'
},
lightbox: {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: rgba(0, 0, 0, 0.5)
},
resultingPath: {
  marginBottom: '1em'
},
cancelButton: {
  borderLeft: 'solid 0.2em #005aff'
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