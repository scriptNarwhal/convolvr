import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import { rgba, rgb } from '../../../util'
import { isMobile } from '../../../config'
import BuiltinProps from '../../../assets/props'
import { getPropsList } from '../../../assets/props'
import { 
  textAreaStyle,
  lightboxStyle, 
  textTitleInputStyle,
  modalStyle 
} from '../../styles'
class PropertyEditor extends Component {

  constructor () {
    super()
  }

  componentWillMount () {

    this.setState({
      activated: false,
      text: "",
      name: "",
      data: {},
      refreshing: false
    })

    if ( !this.props.editLoadedItemActivated )
    
      this.useTemplate("geometry.0")

  }

  componentWillReceiveProps ( nextProps ) {

    if ( nextProps.source == nextProps.editSource ) {

      if (this.props.itemId != nextProps.itemId || this.props.category != nextProps.category) {

        this.loadPropertyData(this.props, nextProps)

      }

      if (this.props.activated == false && nextProps.activated == true)

        this.setState({
          activated: true
        })

      let loadEditItemActiveChanged = this.props.editLoadedItemActivated == false && nextProps.editLoadedItemActivated,
        itemIndexChanged = this.props.loadedItemIndex != nextProps.loadedItemIndex,
        itemIdChanged = this.props.itemId != nextProps.itemId


      if (loadEditItemActiveChanged || itemIndexChanged || itemIdChanged) {

        this.loadPropertyData(this.props, nextProps)

        this.setState({
          index: nextProps.loadedItemIndex
        })

      }

    }
    
  }

  loadPropertyData ( props, nextProps ) {

    console.info("propertyEditor edit load property data: editSource, editData, ", nextProps.editSource, nextProps.loadedItemData)
    if ( nextProps.editSource == "componentEdit" ) { // load from component in inventory
      if ( nextProps.loadedItemData ) {

        this.setState( nextProps.loadedItemData )      
        this.setText( nextProps.loadedItemData.name, nextProps.loadedItemData.data, false )

      } else {

          console.warn("missing property action data")
          this.setState({activated: false})

      }
    } else { // load from inventory
      let inventoryData = nextProps.properties[ nextProps.itemIndex || nextProps.itemId ]

      if ( inventoryData ) {

        this.setState( inventoryData )         
        this.setText( inventoryData.name, inventoryData.data, false )

      } else {

        console.warn("missing property inventory data")
        this.setState({activated: false})

      }
    }

  }

  componentWillUpdate ( nextProps, nextState ) {

  }

  useTemplate( name: string ) {

    let template: string = "",
        propName: string = ""

    template = this.props.convolvrProps.find( (prop) => { return prop.name == name} )

    propName = name.split(".")[0]
    this.setText( propName, template.data, true )

  }

  setText ( propName: string, data: Object, addName: boolean ) {

    this.setState({
      name: propName,
      text: JSON.stringify( addName ? { [propName]: data } : data, null, "\t"),
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

        let name: string = this.state.name,
            newId: number = typeof this.props.properties == 'object' ? this.props.properties.length : 0

        if ( name == "" ) {

            alert("Name is required.")
            return
        }

        if (this.validate() != null) {
          alert("Property must be valid JSON.")
          return
        }

        if ( this.props.onSave ) {

          this.props.onSave( { name, data: JSON.parse(this.state.text) } )

        } else if (this.state.activated) {

          if ( this.state.id != -1) 

            newId = this.state.id

          this.props.addInventoryItem( this.props.username, "Properties", { id: newId, name, data: JSON.parse(this.state.text) } )

        }

        this.toggleModal()

    }

    validate() {

        let valid: boolean = null,
            output: Object = {}

        try {
          output = JSON.parse(this.state.text)
        } catch (e) {
          console.warn("invalid json ", e)
          return true
        }

        return valid

    }

  toggleModal () {

    if ( this.state.activated) {
      this.props.closePropertyEditor()
    }
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
              {  this.state.activated && !this.state.refreshing ? (
                <textarea defaultValue={ this.state.text } style={ styles.textArea( isMobile() ) } onBlur={ e=> this.handleTextArea(e) } />
              ) : ""}
              <FileButton title="Save" onClick={ () => { this.save() } } />
              <FileButton title="Cancel" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
            </div>
          </div>
        </div>
      )

    } else {

      return (
        <FileButton title={this.props.title} onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
}

PropertyEditor.defaultProps = {
  title: "New Property",
  source: "inventory",
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
        section: state.routing.locationBeforeTransitions.pathname,
        menuOpen: state.app.menuOpen,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.propertyEdit.activated,
        itemId: state.util.propertyEdit.itemId,
        properties: state.inventory.items.properties,
        editLoadedItemActivated: state.util.loadedItemEdit.activated.property && state.util.loadedItemEdit.category == "Properties",
        loadedItemIndex: state.util.loadedItemEdit.index,
        loadedItemData: state.util.loadedItemEdit.data.property,
        instances: state.util.propertyEdit.windowsOpen,
        editSource: state.util.loadedItemEdit.source.property,
        category: state.util.loadedItemEdit.category
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
    return Object.assign({}, modalStyle(isMobile()), {
        maxWidth: '960px',
        height: '84%',
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
  text: textTitleInputStyle,
  textArea: textAreaStyle,
  body: {
  },
  title: {

  }
}