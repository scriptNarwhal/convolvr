import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import { rgba, rgb } from '../../../util'

class ImportToWorld extends Component {

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

  onCoordChange ( value, event ) {



  }

  handleWorldChange ( event ) {

    let value = event.target.value

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
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Import To World</span> 
                <input type="text" disabled onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } /> 
              </span>
              <span>
                Select world to import into
                <select onChange={ e=> this.handleWorldChange(e) }>
                  {
                    this.props.worlds.map( (world, w) => {
                       
                      return (
                        <option key={w}value={world.name}>{world.name}</option>
                      )

                    })
                  }
                </select>
              </span>
              <span>
                Specify coordinates: <VectorInput axis={3} decimalPlaces={0} onChange={ (value, event) => { this.onCoordChange( value, event) }} />
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
        <FileButton title="Import To World" onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
}

ImportToWorld.defaultProps = {

}

import { connect } from 'react-redux'
import {
    closeImportToWorld
} from '../../../redux/actions/util-actions'

export default connect(
  (state, ownProps) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode,
        worlds: state.worlds.all,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.importToWorld.activated,
        filename: state.util.importToWorld.filename,
        fileUser: state.util.importToWorld.username,
        dir: state.util.importToWorld.dir
    }
  },
  dispatch => {
    return {
      closeImportToWorld: () => {
        dispatch( closeImportToWorld() )
      }
    }
  }
)(ImportToWorld)

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
    background: rgba(0, 0, 0, 0.5)
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