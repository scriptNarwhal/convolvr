
import * as React from "react"; import { Component } from "react";

import ComponentEditor from './component-editor'

import { isMobile } from '../../../config'
import { 
  Card,
  FileButton,
  VectorInput,
  textAreaStyle,
  basicInputStyle,
  lightboxStyle, 
  modalStyle 
} from 'energetic-ui'

type EntityEditorProps = {
  contextMenuOptions: any[],
  title?: string
}

class EntityEditor extends Component<any, any> {

  private defaultProps: EntityEditorProps;

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

  componentWillReceiveProps ( nextProps: any ) {

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

    if (this.props.editLoadedItemActivated == false && nextProps.editLoadedItemActivated) {
      if ( nextProps.entities && nextProps.entities[ nextProps.loadedItemIndex ]) {
        this.setState(nextProps.entities[ nextProps.loadedItemIndex ])
      } 

      this.setState({
        index: nextProps.loadedItemIndex,
        refreshing: true
      }, () => {
        this.setState({
          refreshing: false
        })
      })
    }
  }

  componentWillUpdate ( nextProps: any, nextState: any ) {

  }

  useTemplate(name: string): string {
    let template: any = ""

    switch ( name ) {
      case "Wireframe Box":
        template = {
          position: [0, 0, 0],
          quaternion: [0, 0, 0, 1],
          name: "New Entity",
          id: -1,
          components: [
            {
              name: "Box",
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
              name: "Sphere",
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

  public handleContextAction( action: string, data: any, e: any ): void {
    let index:          number        = data.componentIndex,
        components:     any[] = this.state.components,
        componentData:  any        = components[ index ]

    if ( action == "Delete" ) {   
        components.splice( index, 1 )
        this.setState({ components })
            
    } else if (action == "Edit") {
        console.info("EDITING COMPONENT~ ", componentData, index)
        this.props.editLoadedItem("entityEdit", this.props.username, "Components", index, componentData)
    }
  }

  public save(): void {
    let name = this.state.name,
        newId = typeof this.props.components == 'object' ? this.props.components.length : 0,
        data: any = {}

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
  
      if (data.id == -1) 
        data.id = newId

      this.props.addInventoryItem( this.props.username, "Entities", data )   
    }
    this.toggleModal()
  }

  validate( ): boolean {     
    let valid = null

    return valid
  }

  toggleModal ( ) {
    if ( this.state.activated )
      this.props.closeEntityEditor()

    this.setState({
      activated: !this.state.activated
    })
  }

  onPositionChange ( value: Array<number>, event: any ) {
    this.setState({
      position: value
    })
  }

  onRotationChange ( value: Array<number>, event: any ) {
    this.setState({
      quaternion: value
    })
  }

  onNameChange(e: any) {
    this.setState({
      name: e.target.value
    })
  }

  onIdChange(e: any) {
    this.setState({
      id: parseInt(e.target.value)
    })
  }

  onSaveComponent(data: any) {
    let components = []

    components = this.state.components

    if ( data.id <= -1 )
      data.id = this.state.components.length
      
    
    components.push( data )

    this.setState({
      components
    })

  }

  render ( ) {

    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox as any }>
          <div style={ styles.modal() } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Entity Edit</span> 
                { !this.state.refreshing ? (
                <input defaultValue={ this.state.name } type="text" onChange={ (e) => { this.onNameChange(e) }} style={ styles.text } />
                ) : ""} 
              </span>
            </div>
            <div style={ styles.body }>
              <span style={styles.basicInput} title='Position'>
                <span>Position</span> 
                <VectorInput axis={3} decimalPlaces={2} onChange={ (value: any, event: any) => { this.onPositionChange( value, event) }} />
              </span>
              <span style={styles.basicInput} title='Rotation'>
                <span>Rotation</span> 
                <VectorInput axis={4} decimalPlaces={4} onChange={ (value: any, event: any) => { this.onRotationChange( value, event) }} />
              </span>
              <div style={ styles.components as any }>
                {
                  this.state.components.map( (component: any, i: number) => {
                    return (
                      <Card clickHandler={ (e: any) => {
                              console.log(e, component.name, "clicked")
                              this.handleContextAction("Edit",  { componentIndex: i }, {} )
                            }}
                            onContextMenu={ (name: string, data: any, e: any) => this.handleContextAction(name, {...data, componentIndex: i }, e) }
                            contextMenuOptions={ this.props.contextMenuOptions }
                            showTitle={true}
                            compact={true}
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
              <ComponentEditor onSave={ (data: any) => this.onSaveComponent( data ) } 
                               username={ this.props.username }
                               source={"entityEdit"}
                               title="Add Component"
              />
              <FileButton title="Save" onClick={ () => { this.save() } } />
              <FileButton title="Cancel" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
            </div>
          </div>
        </div>
      )

    } else {

      return (
        <FileButton title={this.props.title || "New Entity"} onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
}

import { connect } from 'react-redux'
import {
  readText,
  writeText
} from '../../redux/actions/file-actions'
import {
    getInventory,
    addInventoryItem,
    getInventoryItem,
    updateInventoryItem
} from '../../redux/actions/inventory-actions'
import {
    closeEntityEditor,
    launchEditLoadedItem
} from '../../redux/actions/util-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.app.navigateToUrl.pathname,
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
        entities: state.inventory.items.entities,
        editLoadedItemActivated: state.util.loadedItemEdit.activated && state.util.loadedItemEdit.category == "Entities",
        loadedItemIndex: state.util.loadedItemEdit.index,
        loadedItemSource: state.util.loadedItemEdit.source.entity,
        loadedItemData: state.util.loadedItemEdit.data.component,
        instances: state.util.entityEdit.windowsOpen,
        vrMode: state.app.vrMode
    }
  },
  (dispatch: any) => {
    return {
      editLoadedItem: ( source: string, username: string, category: string, index: number, data: any ) => {
        dispatch(launchEditLoadedItem( source, username, category, index, data ))
      },
      getInventory: (userId: number, category: string) => {
        dispatch(getInventory(userId, category))
      },
      getInventoryItem: (userId: number, category: string, itemId: number) => {
        dispatch(getInventoryItem( userId, category, itemId ))
      },
      addInventoryItem: (userId: number, category: string, data: any) => {
          dispatch(addInventoryItem(userId, category, data))
      },
      updateInventoryItem: (userId: number, category: string, data: any) => {
      dispatch(updateInventoryItem(userId, category, data))
      },
      closeEntityEditor: () => {
        dispatch( closeEntityEditor() )
      }
    }
  }
)(EntityEditor)

let styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
          maxWidth: '1180px',
          left: ! isMobile() ? '72px' : '0px'
       })
    },
    basicInput: basicInputStyle,
    id: {
      marginRight: '0.5em',
    },
    lightbox: lightboxStyle,
    resultingPath: {
        marginBottom: '1em'
    },
    cancelButton: {
        borderLeft: 'solid 0.2em #005aff'
    },
    components: {

    },
    header: {
        width: '100%',
        marginTop: '0.5em',
        marginBotto: '0.5em'
    },
    textInput: {

    },
    text: {
        width: '40%',
        padding: '0.25em',
        marginBottom: '0.5em',
        background: '#212121',
        border: 'none',
        borderRadius: '2px',
        fontSize: '1em',
        color: 'white'
    },
    textArea: textAreaStyle,
    body: {

    },
    title: {

    }
}