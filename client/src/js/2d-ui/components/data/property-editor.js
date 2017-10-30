import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import { rgba, rgb } from '../../../util'
import { isMobile } from '../../../config'
import BuiltinProps from '../../../assets/props'
import { getPropsList } from '../../../assets/props'

class PropertyEditor extends Component {

  constructor () {
    super()
  }

  componentWillMount () {

    this.setState({
      activated: false,
      text: "",
      name: "",
      refreshing: false
    })

    if ( !this.props.itemId )
    
      this.useTemplate("geometry.0")

  }

  componentWillReceiveProps ( nextProps ) {

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

      if ( this.props.editLoadedItemActivated == false && nextProps.editLoadedItemActivated ) {
        
        if ( nextProps.editSource == "componentEdit" ) { // load from component in inventory
          
          if ( nextProps.loadedItemData ) {
              this.setState( nextProps.loadedItemData )                    
          } else {
              alert("missing property action data")
              this.setState({activated: false})
          }

        } else { // load from inventory
        
          if ( nextProps.properties[ nextProps.loadedItemIndex ] ) {
            this.setState( nextProps.properties[ nextProps.loadedItemIndex ] )         
          } else {
            alert("missing property inventory data")
            this.setState({activated: false})
          }
          
        }

        this.setState({
          index: nextProps.loadedItemIndex
        })
        
      }
    
  }

  componentWillUpdate ( nextProps, nextState ) {

  }

  useTemplate( name ) {

    let template = ""

    template = this.props.convolvrProps.find( (prop) => { return prop.name == name} )

    this.setState({
      name: template.name.split(".")[0],
      text: JSON.stringify(template.data),
      refreshing: true
    }, ()=>{
      this.setState({
        refreshing: false
      })
    })

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

        if ( name == "" ) {

            alert("Name is required.")
            return
        }

        if (this.validate() != null) {
          alert("Property must be valid JSON.")
          return
        }

        if ( this.props.onSave ) {

          this.props.onSave( { [this.state.name]: JSON.parse(this.state.text) } )

        } else {

          this.props.addInventoryItem( this.props.username, "Properties", { [this.state.name]: JSON.parse(this.state.text) } )

        }

        this.toggleModal()

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

        return valid

    }

  toggleModal () {

    this.props.closePropertyEditor()
    this.setState({
      activated: !this.state.activated
    })

  }

  render() {

    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox }>
          <div style={ styles.modal() } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Property Edit</span> 
                { !this.state.refreshing ? 
                  <input type="text" defaultValue={ this.state.name }  style={ styles.text } 
                         onChange={ (e) => { this.handleTextChange(e) }} 
                  /> 
                  : ""
                } 
                <select onChange={ e=> { this.useTemplate( e.target.value ) } } >
                  {
                    this.props.convolvrProps.map( (prop, p) => {
                      let propName = `${prop.name}`
                      return (
                        <option key={p} value={propName}>{propName}</option>
                      )
                    })
                  }
                </select>
              </span>
            </div>
            <div style={ styles.body }>
              {  !this.state.refreshing ? (
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
  convolvrProps: getPropsList( BuiltinProps() )
}

import { connect } from 'react-redux'
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
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.propertyEdit.activated,
        fileUser: state.util.propertyEdit.username,
        itemId: state.util.propertyEdit.itemId,
        properties: state.inventory.items.properties,
        editLoadedItemActivated: state.util.loadedItemEdit.activated && state.util.loadedItemEdit.category == "Properties",
        loadedItemIndex: state.util.loadedItemEdit.index,
        loadedItemData: state.util.loadedItemEdit.data.component,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      editLoadedItem: ( source, username, category, index, data ) => {
        dispatch(launchEditLoadedItem( source, username, category, index, data ))
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
      closePropertyEditor: () => {
        dispatch( closePropertyEditor() )
      }
    }
  }
)(PropertyEditor)

let styles = {
  modal: () => {
    return {
      width: '100%',
      maxWidth: '960px',
      minWidth: '320px',
      height: '92%',
      padding: '1em',
      position: 'absolute',
      top: '0px',
      left: ! isMobile() ? '72px' : '0px',
      right: '0px',
      bottom: '0px',
      margin: 'auto',
      background: rgb(38, 38, 38)
    }
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
        width: '65%',
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