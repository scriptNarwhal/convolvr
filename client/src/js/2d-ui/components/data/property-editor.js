import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import {
    rgba,
    rgb
} from '../../../util'

class PropertyEditor extends Component {

  constructor () {
    super()
  }

  componentWillMount () {

    this.setState({
      activated: false,
      text: "",
      name: ""
    })
    
  }

  componentWillReceiveProps ( nextProps ) {

    if ( this.props.readTextFetching && nextProps.readTextFetching == false && !!nextProps.textData )

      this.setState({
        text: nextProps.textData.text
      })


    if ( this.props.itemId != nextProps.itemId || this.props.category != nextProps.category ) {

      if ( nextProps.category != "" && nextProps.itemId != "" )

        this.setState({
          name: nextProps.itemId
        })

    }

    if ( this.props.activated == false && nextProps.activated == true )

      this.setState({
        activated: true
      })

    
  }

  componentWillUpdate ( nextProps, nextState ) {

  }

  useTemplate( name ) {

    let template = ""

    switch ( name ) {

        case "Box Shape":
            template = {
                geometry: {
                    shape: "box",
                    size: [1, 1, 1]
                }
            }
        break
        case "Text Area":
            template = {
                text: {
                    color: "#000000",
                    background: "#ffffff",
                    lines: ["Hello World"]
                }
            }
        break
        case "The Color Red":
            template = {
                material: {
                    color: 0xff0000
                }
            }
        break

    }

    return JSON.stringify(template)

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

            //this.props.writeText( this.state.text, name, this.props.fileUser || this.props.username, dir )
            this.toggleModal()

        } else {

            alert("Name is required.")

        }

    }

    validate() {

        let valid = null,
            output = null

        try {
          output = JSON.parse(this.state.text)
        } catch (e) {
          console.warn("invalid json ", e)
          return true
        }
    
        valid = typeof output != 'object'

        return valid

    }

  toggleModal () {

    this.setState({
      activated: !this.state.activated
    })
    this.props.closePropertyEditor()

  }

  render() {

    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox }>
          <div style={ styles.modal } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Property Edit</span> 
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
        <FileButton title="New Property" onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
}

PropertyEditor.defaultProps = {

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
    getInventory,
    addInventoryItem,
    updateInventoryItem
} from '../../../redux/actions/inventory-actions'
import {
    closePropertyEditor
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
        activated: state.util.propertyEdit.activated,
        fileUser: state.util.propertyEdit.username,
        itemId: state.util.propertyEdit.itemId,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      getInventory: (userId, category) => {
        dispatch(getInventory(userId, category))
      },
      addInventoryItem: (userId, category, data) => {
        dispatch(addInventoryItem(userId, category, data))
      },
      updateInventoryItem: (userId, category, data) => {
        dispatch(updateInventoryItem(userId, category, data))
      },
      closePropertyEditor: () => {
        dispatch( closePropertyEditor() )
      },
      toggleMenu: (force) => {
          dispatch(toggleMenu(force))
      }
    }
  }
)(PropertyEditor)

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
        color: 'white'
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