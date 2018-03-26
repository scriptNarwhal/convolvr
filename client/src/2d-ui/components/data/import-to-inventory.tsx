import * as React from "react"; import { Component } from "react";
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import {
  rgba,
  rgb
} from '../../../util'
import { 
  textAreaStyle,
  lightboxStyle, 
  modalStyle 
} from '../../styles'

class ImportToInventory extends Component<any, any> {

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

  componentWillReceiveProps ( nextProps: any) {

    if ( this.props.activated == false && nextProps.activated == true ) {
      
      this.setState({
        activated: true,
        name: this.props.filename
      })
      
    }

  }

  componentWillUpdate ( nextProps: any, nextState: any ) {

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

    this.props.closeImportToInventory()
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
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>
                Import To Inventory As Entity
              </span> 
                <input type="text" onChange={ (e) => { this.handleTextChange(e) }} 
                       defaultValue={this.state.name} 
                       style={ styles.text } 
                /> 
              </span>
            </div>
            <div style={ styles.body }>
              <textarea style={ styles.textArea( isMobile() ) } onBlur={ e=> this.handleTextArea(e) } />
              <FileButton title="Save" onClick={ () => { this.save() } } />
              <FileButton title="Close" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
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
  (state: any, ownProps: any) => {
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
        dir: state.util.importToInventory.dir,
        instances: state.util.importToInventory.windowsOpen
    }
  },
  (dispatch: any) => {
    return {
      closeImportToInventory: () => {
        dispatch( closeImportToInventory() )
      }
    }
  }
)(ImportToInventory)

let styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
        maxWidth: '1080px',
        left: ! isMobile() ? '72px' : '0px'
      })
  },
  lightbox: lightboxStyle,
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
  textArea: textAreaStyle,
  body: {

  },
  title: {

  }
}