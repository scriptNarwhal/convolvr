import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'

class InventoryEditor extends Component {

  constructor () {
    super()
  }

  componentWillMount () {

    this.setState({
      activated: false,
      text: "",
      name: ""
    })

    if ( !!this.props.fileURL )

      this.props.readText( this.props.fileURL, this.props.username, this.props.cwd.join("/") )
    
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

  useTemplate(category) {
    
            let template = ""
    
            switch (category) {
                case "Entities":
                    template = {
                        position: [0, 0, 0],
                        quaternion: [0, 0, 0, 1],
                        name: "New Entity",
                        id: -1,
                        components: [
                            {
                                position: [0, 0, 0],
                                quaternion: [0, 0, 0, 1],
                                props: {
                                    geometry: {
                                        shape: "box",
                                        size: [1, 1, 1]
                                    },
                                    material: {
                                        name: "wireframe",
                                        color: 0xffffff
                                    }
                                },
                                components: []
                            }
                        ]
                    }
                    break;
                case "Components":
                    template = {
                        position: [0, 0, 0],
                        quaternion: [0, 0, 0, 1],
                        props: {
                            geometry: {
                                shape: "box",
                                size: [1, 1, 1]
                            },
                            material: {
                                name: "wireframe",
                                color: 0xffffff
                            }
                        },
                        components: []
                    }
                    break;
                case "Properties":
                    template = {
                        geometry: {
                            shape: "box",
                            size: [1, 1, 1]
                        }
                    }
                    break;
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

        let valid = null

        return valid

    }

  toggleModal () {

    this.setState({
      activated: !this.state.activated
    })
    this.props.closeTextEdit()

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

InventoryEditor.defaultProps = {

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
}
import {
    closeInventoryEditor
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
        activated: state.util.inventoryEditor.activated,
        filename: state.util.inventoryEditor.category,
        fileUser: state.util.inventoryEditor.username,
        itemId: state.util.inventoryEditor.itemId,
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
      getInventory: (userId, category) => {
        dispatch(getInventory(userId, category))
      },
      addInventoryItem: (userId, category, data) => {
          dispatch(addInventoryItem(userId, category, data))
      },
      updateInventoryItem: (userId, category, data) => {
      dispatch(updateInventoryItem(userId, category, data))
      },
      closeInventoryEditor: () => {
        dispatch( closeInventoryEditor() )
      },
      toggleMenu: (force) => {
          dispatch(toggleMenu(force))
      }
    }
  }
)(InventoryEditor)

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