import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import { rgba, rgb } from '../../../util'

class MoveFile extends Component {

  constructor () {

    super()
    
  }

  componentWillMount () {

    this.setState({
      activated: false,
      resultingPath: "",
      name: ""
    })

  }

  componentWillReceiveProps ( nextProps ) {

    if ( this.props.creatingDir && nextProps.creatingDir == false ) {

      this.props.listDirectories( nextProps.username, nextProps.cwd.join("/") )

    }

    if ( this.props.activated == false && nextProps.activated == true )
    
      this.setState({
        activated: true,
        name: nextProps.filename
      })

    

  }

  componentWillUpdate ( nextProps, nextState ) {


  }

  toggleModal () {

    this.props.closeRenameFile()
    this.setState({
      name: "",
      activated: !this.state.activated
    })

  }

  handleTextChange (e) {

    this.setState({
      name: e.target.value
    })

  }

  rename () {

    let cwd = this.props.cwd.join("/"),
        dirName = this.state.name.indexOf(' ') > -1 ? this.state.name.split(' ').join('-') : this.state.name,
        name = this.state.name

    if ( name != "" ) {

      this.props.moveFile( this.props.username, cwd, this.props.filename, name, cwd )
      this.toggleModal()

    } else {

      alert("Name is required.")

    }

  }

  render() {

    let cwd = !! this.props.cwd ? this.props.cwd.join("/") : "",
        resultingPath = `${this.props.username}${cwd}/${this.state.name.split(' ').join('-')}`

    if ( this.state.activated ) {

      return (
        <div style={ styles.lightbox }>
          <div style={ styles.modal } >
            <div style={ styles.header }>
              <span style={ styles.title }> Rename File </span>
            </div>
            <div style={ styles.body }>
              <input type="text" defaultValue={this.state.name} onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } />
              <div style={ styles.resultingPath }>
                { resultingPath }
              </div>
              <FileButton title="Rename" onClick={ () => { this.rename() } } />
              <FileButton title="Cancel" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
            </div>
          </div>
        </div>
      )

    } else {

      return (
        <span></span>
      )

    }
    
  }
}

MoveFile.defaultProps = {

}

import { connect } from 'react-redux'
import {
  closeRenameFile
} from '../../../redux/actions/util-actions'
import {
  moveFile,
  listDirectories
} from '../../../redux/actions/file-actions'

export default connect(
  (state, ownProps) => {
    return {
        creatingDir: state.files.move.fetching,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        cwd: state.files.listDirectories.workingPath,
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode,
        activated: state.util.renameFile.activated,
        filename: state.util.renameFile.filename,
        fileUser: state.util.renameFile.username,
        dir: state.util.renameFile.dir,
    }
  },
  dispatch => {
    return {
      moveFile: ( username, dir, filename, targetDir, targetFile ) => {
        dispatch( moveFile( username, dir, filename, targetFile, targetDir ) )
      },
      closeRenameFile: () => {
        dispatch(closeRenameFile())
      },
      listDirectories: (username, dir) => {
          dispatch(listDirectories(username, dir))
      }
    }
  }
)(MoveFile)

let styles = {
modal: {
  width: '20%',
  maxWidth: '729px',
  minWidth: '320px',
  height: '192px',
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
body: {

},
title: {

}
}
