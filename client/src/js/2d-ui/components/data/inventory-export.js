import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import { rgba, rgb } from '../../../util'
import { isMobile } from '../../../config'
import { 
  textAreaStyle,
  lightboxStyle, 
  modalStyle 
} from '../../styles'

class InventoryExport extends Component {

  constructor () {

    super()

  }

  componentWillMount () {

    this.setState({
      activated: false,
      refreshing: false,
      text: "",
      name: ""
    })

    
  }

  componentWillReceiveProps ( nextProps ) {

    let data = {}

    if ( this.props.activated == false && nextProps.activated == true ) {

      this.setState({
        activated: true
      })

      if (nextProps.itemData) {

        data = { ...nextProps.itemData }

        if ( nextProps.category == "Properties")

          data = data.data

        this.setState({
          refreshing: true,
          name: nextProps.itemData.name,
          text: JSON.stringify(data, null, "\t")
        }, () => {
          this.setState({
            refreshing: false
          })
        })

      }

    }

  }

  componentWillUpdate ( nextProps, nextState ) {

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

      // initiate file download maybe
      this.toggleModal()

    } else {

      alert("Name is required.")

    }

  }

  toggleModal () {

    this.setState({
      activated: !this.state.activated
    })
    this.props.closeInventoryExport()

  }

  toFileName (s) {

    return s.replace(/(ies)/, 'y').replace('ents', 'ent').toLowerCase().replace(/(\s|\n|\t)/g, '-')

  }

  render() {

    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox }>
          <div style={ styles.modal() } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Export</span> 
              { this.state.name }.{ this.toFileName(this.props.category) }.json
              </span>
            </div>
            <div style={ styles.body }>
              { this.state.refreshing == false  ? (
                <textarea defaultValue={ this.state.text } style={ styles.textArea( isMobile() ) } onBlur={ e=> this.handleTextArea(e) } />
              ) : ""}
              <FileButton title="Download" onClick={ () => { this.save() } } style={{display:"none"}} />
              <FileButton title="Done" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
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

InventoryExport.defaultProps = {

}

import { connect } from 'react-redux'
import {
    getInventory,
    getInventoryItem,
    addInventoryItem,
    updateInventoryItem
} from '../../../redux/actions/inventory-actions'
import {
    closeInventoryExport
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
        activated: state.util.inventoryExport.activated,
        category: state.util.inventoryExport.category,
        fileUser: state.util.inventoryExport.username,
        itemData: state.util.inventoryExport.itemData,
        itemId: state.util.inventoryExport.itemId,
        itemIndex: state.util.inventoryExport.itemIndex,
        instances: state.util.inventoryExport.windowsOpen,
    }
  },
  dispatch => {
    return {
      getInventory: (userId, category) => {
        dispatch(getInventory(userId, category))
      },
      getInventoryItem: ( userId, category, itemId ) => {
        dispatch(getInventoryItem( userId, category, itemId ))
      },
      addInventoryItem: (userId, category, data) => {
          dispatch(addInventoryItem(userId, category, data))
      },
      updateInventoryItem: (userId, category, data) => {
      dispatch(updateInventoryItem(userId, category, data))
      },
      closeInventoryExport: () => {
        dispatch( closeInventoryExport() )
      }
    }
  }
)(InventoryExport)

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
      color: 'white'
  },
  textArea: (mobile) => { return {...textAreaStyle( mobile ), minHeight: '50vh' } },
  body: {
  },
  title: {

  }
}