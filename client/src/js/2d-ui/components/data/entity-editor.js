import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import Card from '../card'
import ComponentEditor from './component-editor'
import VectorInput from '../vector-input'
import {
  rgba,
  rgb
} from '../../../util'

class EntityEditor extends Component {

  constructor () {
    super()
  }

  componentWillMount () {

    this.setState({
      activated: false,
      position: [0,0,0],
      quaternion: [0,0,0,1],
      id: -1,
      components: [],
      text: "",
      name: ""
    })

    if ( !this.props.itemId )
    
      this.useTemplate("Wireframe Box")
    
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
      case "Wireframe Box":
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
      break
      case "Solid Sphere":
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
                  shape: "sphere",
                  size: [2, 2, 2]
                },
                material: {
                  name: "metal",
                  color: 0xffffff
                }
              },
              components: []
            }
          ]
        }
      break
    }

    this.setState( template )

    return JSON.stringify( template )

  }

  handleContextAction ( action, data, e ) {
    
    let index = data.componentIndex,
    components = this.state.components

    if ( action == "Delete" ) {
            
        components.splice( index, 1 )
        this.setState({ components })
            
    } else if (action == "Edit") {

        this.props.editLoadedItem("component", data, index)

    }
    
  }

  save () {

    let name = this.state.name,
      dir = this.props.activated ? this.props.dir : this.props.cwd.join("/")

    if ( name == "" )  {
        
      alert("Name is required.")
      return
        
    }

    data = {
      id: this.state.id,
      name: this.state.name,
      position: this.state.position,
      quaternion: this.state.quaternion,
      components: this.state.components
    }

    if ( this.props.onSave ) {
        
        this.props.onSave( data )
        
    } else {
        
        this.props.addInventoryItem( this.props.username, "Entities", data )
        
    }

    this.toggleModal()

  }

  validate ( ) {

    let valid = null

    return valid

  }

  toggleModal ( ) {

    this.setState({
      activated: !this.state.activated
    })
    this.props.closeEntityEditor()

  }

  onPositionChange ( value, event ) {

    this.setState({
      position: value
    })

  }

  onRotationChange ( value, event ) {

    this.setState({
      quaternion: value
    })

  }

  onNameChange(e) {

    this.setState({
      name: e.target.value
    })

  }

  onIdChange(e) {

    this.setState({
      id: e.target.value
    })

  }

  onSaveComponent( data ) {

    let components = []

    components = this.state.components

    if ( data.id <= -1 ) {

      data.id = this.state.components.length
      components.push( data )

    } else {

      components.splice( data.id, 1, data)

    }

    this.setState({
      components
    })

  }

  render ( ) {

    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox }>
          <div style={ styles.modal } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Entity Edit</span> 
                <input defaultValue={ this.state.name } type="text" onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } /> 
              </span>
            </div>
            <div style={ styles.body }>
              <span style={styles.basicInput} title='ID'>
                <span>ID</span> 
                <input type="text" style={styles.textInput} defaultValue={this.state.id} onChange={ e=> { this.onIdChange(e) }} />
              </span>
              <br/>
              <span style={styles.basicInput} title='Position'>
                <span>Position</span> 
                <VectorInput axis={3} decimalPlaces={2} onChange={ (value, event) => { this.onPositionChange( value, event) }} />
              </span>
              <span style={styles.basicInput} title='Rotation'>
                <span>Rotation</span> 
                <VectorInput axis={4} decimalPlaces={4} onChange={ (value, event) => { this.onRotationChange( value, event) }} />
              </span>
              <div style={ styles.components }>
                {
                  this.state.components.map( (component, i) => {
                    return (
                      <Card clickHandler={ (e) => {
                              console.log(e, component.name, "clicked")
                            
                            }}
                            onContextMenu={ (name, data, e) => this.handleContextAction(name, {...data, componentIndex: i }, e) }
                            contextMenuOptions={ this.props.contextMenuOptions }
                            showTitle={true}
                            username={this.props.username}
                            dir={this.props.dir}
                            category={"Components"}
                            title={component.name}
                            image=''
                            key={i}
                      />
                    )
                  })
                }
              </div>
              <ComponentEditor onSave={ data => this.onSaveComponent( data ) } 
                               username={ this.props.username }
              />
              <FileButton title="Save" onClick={ () => { this.save() } } />
              <FileButton title="Cancel" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
            </div>
          </div>
        </div>
      )

    } else {

      return (
        <FileButton title="New Entity" onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
}

EntityEditor.defaultProps = {
  contextMenuOptions: [
    { name: "Edit" },
    { name: "Delete"}
  ]
}

import { connect } from 'react-redux'
import {
  readText,
  writeText
} from '../../../redux/actions/file-actions'
import {
    getInventory,
    addInventoryItem,
    getInventoryItem,
    updateInventoryItem
} from '../../../redux/actions/inventory-actions'
import {
    closeEntityEditor,
    launchEditLoadedItem
} from '../../../redux/actions/util-actions'

export default connect(
  (state, ownProps) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        inventoryItem: state.inventory.item.entity,
        inventoryFetching: state.inventory.fetching,
        textData: state.files.readText.data,
        readTextFetching: state.files.readText.fetching,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.entityEdit.activated,
        fileUser: state.util.entityEdit.username,
        itemId: state.util.entityEdit.itemId,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      editLoadedItem: ( category, itemId ) => {
        dispatch(launchEditLoadedItem( category, itemId ))
      },
      getInventory: (userId, category) => {
        dispatch(getInventory(userId, category))
      },
      getInventoryItem: (userId, category, itemId ) => {
        dispatch(getInventoryItem( userId, category, itemId ))
      },
      addInventoryItem: (userId, category, data) => {
          dispatch(addInventoryItem(userId, category, data))
      },
      updateInventoryItem: (userId, category, data) => {
      dispatch(updateInventoryItem(userId, category, data))
      },
      closeEntityEditor: () => {
        dispatch( closeEntityEditor() )
      }
    }
  }
)(EntityEditor)

let styles = {
    modal: {
      width: '100%',
      maxWidth: '1280px',
      minWidth: '320px',
      height: '92%',
      padding: '1em',
      position: 'absolute',
      top: '0px',
      left: '0px',
      right: '0px',
      bottom: '0px',
      margin: 'auto',
      background: rgb(38, 38, 38)
    },
    basicInput: {
        display: 'block'
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
    textInput: {

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