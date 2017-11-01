import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import { rgba, rgb } from '../../../util'
import { isMobile } from '../../../config'

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

    if ( this.props.itemId != nextProps.itemId || this.props.category != nextProps.category ) {

      if ( nextProps.category != "" && nextProps.itemId != "" ) {

        
        this.setState({
          name: nextProps.itemId
        })
      }

    }

    if ( this.props.itemFetching && nextProps.itemFetching == false) {

      if ( nextProps.itemData ) {

        this.setState({
          refreshing: true,
          text: JSON.stringify(nextProps.itemData, null, "\t")
        }, () => {
          this.setState({
            refreshing: false
          })
        })

      }

    }

    if ( this.props.activated == false && nextProps.activated == true ) {

      this.setState({
        activated: true
      })

      this.props.getInventoryItem( this.props.username, this.props.category, this.props.itemId )

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

  render() {

    if ( this.state.activated ) {

      return (
       <div style={ styles.lightbox }>
          <div style={ styles.modal() } >
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Editing</span> 
                <input defaultValue={ this.state.name } type="text" onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } /> 
              </span>
            </div>
            <div style={ styles.body }>
              { this.state.refreshing == false  ? (
                <textarea defaultValue={ this.state.text } style={ styles.textArea } onBlur={ e=> this.handleTextArea(e) } />
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
        vrMode: state.app.vrMode
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
    return {
      width: '100%',
      maxWidth: '1080px',
      minWidth: '320px',
      height: '92%',
      padding: '1em',
      position: 'absolute',
      top: '0px',
      left: ! isMobile() ? '72px' : '0px',
      right: '0px',
      bottom: '0px',
      margin: 'auto',
      border: '0.1em solid white',
      backgroundColor: "black",
      backgroundImage: 'linear-gradient(rgb(12, 12, 12), rgb(17, 17, 17), rgb(33, 33, 33))'
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