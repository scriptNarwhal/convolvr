import * as React from "react"; 
import { Component } from "react";
import { withRouter } from 'react-router-dom'
import FileButton from './file-button'
import { rgba, rgb } from '../../../util'
import { isMobile } from '../../../config'
import { 
  textAreaStyle,
  lightboxStyle, 
  textTitleInputStyle,
  modalStyle 
} from '../../styles'
class AttributeEditor extends Component<any, any> {

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

  componentWillReceiveProps(nextProps: any) {
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

  loadPropertyData ( props: any, nextProps: any ) {
    console.info("attributeEditor edit load property data: editSource, editData, ", nextProps.editSource, nextProps.loadedItemData)
    if ( nextProps.editSource == "componentEdit" ) { // load from component in inventory
      if ( nextProps.loadedItemData ) {
        this.setState( nextProps.loadedItemData )      
        this.setText( nextProps.loadedItemData.name, nextProps.loadedItemData.data, false )
      } else {
          console.warn("missing property action data")
          this.setState({activated: false})
      }
    } else { // load from inventory
      let inventoryData;

      if (nextProps.itemIndex || nextProps.itemId) {
        inventoryData = nextProps.properties[ nextProps.itemIndex || nextProps.itemId ]
      }

      if ( inventoryData ) {
        this.setState( inventoryData )         
        this.setText( inventoryData.name, inventoryData.data, false )
      } else {
        console.warn("missing property inventory data")
        this.setState({activated: false})
      }
    }
  }

  componentWillUpdate ( nextProps: any, nextState: any ) {

  }

  useTemplate( name: string ) {
    let template: any = "",
        propName: string = ""

    template = this.props.convolvrAttrs.find( (prop: any) => { return prop.name == name} )
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

  handleTextChange(e: any) {
    this.setState({
      name: e.target.value
    })
  }

  handleTextArea(e: any) {
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
      this.props.closeAttributeEditor()
    }
    this.setState({
      activated: !this.state.activated
    })

  }

  render() {
    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox as any }>
          <div style={ styles.modal() } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Attribute Edit</span> 
                { !this.state.refreshing ? 
                  <input type="text" defaultValue={ this.state.name }  style={ styles.text } 
                         onChange={ (e) => { this.handleTextChange(e) }} 
                  /> 
                  : ""
                } 
                <select onChange={ e=> { this.useTemplate( e.target.value ) } } >
                  {
                    this.props.convolvrAttrs.map( (prop: any, p: number) => {
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
        <FileButton title={this.props.title || "New Attribute Preset"} onClick={ () => { this.toggleModal() } } />
      )

    }
    
  }
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
    closeAttributeEditor,
    launchEditLoadedItem
} from '../../../redux/actions/util-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
        section: state.app.navigateToUrl.pathname,
        menuOpen: state.app.menuOpen,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.attributeEdit.activated,
        itemId: state.util.attributeEdit.itemId,
        properties: state.inventory.items.properties,
        editLoadedItemActivated: state.util.loadedItemEdit.activated.property && state.util.loadedItemEdit.category == "Properties",
        loadedItemIndex: state.util.loadedItemEdit.index,
        loadedItemData: state.util.loadedItemEdit.data.property,
        instances: state.util.attributeEdit.windowsOpen,
        editSource: state.util.loadedItemEdit.source.property,
        category: state.util.loadedItemEdit.category
    }
  },
  (dispatch: any) => {
    return {
      editLoadedItem: ( source: string, username: string, category: string, index: number, data: any ) => {
        dispatch(launchEditLoadedItem( source, username, category, index, data ))
      },
      getInventory: (userId: any, category: string) => {
        dispatch(getInventory(userId, category))
      },
      addInventoryItem: (userId: any, category: string, data: any) => {
        dispatch(addInventoryItem(userId, category, data))
      },
      updateInventoryItem: (userId: any, category: string, data: any) => {
        dispatch(updateInventoryItem(userId, category, data))
      },
      closeAttributeEditor: () => {
        dispatch( closeAttributeEditor() )
      }
    }
  }
)(AttributeEditor)

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