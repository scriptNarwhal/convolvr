import React, { Component } from 'react'
import Shell from '../components/shell'
import Card from '../components/card'
import LocationBar from '../components/location-bar'
import InventoryList from './inventory-list'
import {
  isMobile
} from '../../config'

class Inventory extends Component {

  componentWillMount () {

    this.props.listFiles(this.props.username, this.props.workingPath.join("/"))
    this.props.listDirectories(this.props.username, this.props.workingPath.join("/"))

    this.setState({
      update: 0,
      workingPath: []
    })

  }

  componentWillReceiveProps ( nextProps ) {

    let userNameChanged = nextProps.username != this.props.username,
        finishedFetchingDirs = this.props.dirsFetching == true && nextProps.dirsFetching == false,
        finishedFetchingFiles = (this.props.filesFetching == true && nextProps.filesFetching == false)

    

  }

  componentWillUpdate (nextProps, nextState) {


  }

  onContextAction ( name, data, e ) {
    
        switch ( name ) {
    
          case "Import":
            this.props.launchImportToWorld( this.props.username, data )
          break;
          case "Edit JSON":
            // implement
          break;
          case "Export JSON":
            // implement
          break;
    
        }
    
      }

  render() {

    let files = this.props.files,
        dirs = this.props.dirs

    return (
        <Shell className="data-view" 
               style={ isMobile() ? { paddingTop: '60px' } : { paddingTop: '0px' } }
               innerStyle={ { paddingTop: isMobile() ? '72px' : 0, paddingLeft: isMobile() ? '10px' : '72px' }  }       
        >
          <InventoryList onContextAction={ (name, data, e) => this.onContextAction(name, data, e) }
                         options={ this.props.inventoryEntities }
                         category="Entities" 
                         
          />
          <InventoryList onContextAction={ (name, data, e) => this.onContextAction(name, data, e) }
                         options={ this.props.inventoryComponents }
                         category="Components" 
                         
          />
          <InventoryList onContextAction={ (name, data, e) => this.onContextAction(name, data, e) }
                         options={ this.props.inventoryProperties }
                         category="Properties" 
                         
          />
        </Shell>
    )

  }

}

Inventory.defaultProps = {

}

import { connect } from 'react-redux';
import {
    sendMessage
} from '../../redux/actions/message-actions'
import {
  toggleMenu,
  showChat
} from '../../redux/actions/app-actions'
import {
  listFiles,
  listDirectories,
  changeDirectory,
  uploadFiles
} from '../../redux/actions/file-actions'
import {
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  removeInventoryItem,
  addItemToWorld,
} from '../../redux/actions/inventory-actions'

export default connect(
  (state, ownProps) => {
    return {
        loggedIn: state.users.loggedIn,
        username: state.users.loggedIn != false ? state.users.loggedIn.name : "public",
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        chatOpen: state.app.chatOpen,
        vrMode: state.app.vrMode,
        inventoryEntities: state.inventory.items.entities,
        inventoryComponents: state.inventory.items.components,
        inventoryProperties: state.inventory.items.properties,
        files: state.files.list.data,
        dirs: state.files.listDirectories.data,
        filesFetching: state.files.list.fetching,
        dirsFetching: state.files.listDirectories.fetching,
        workingPath: state.files.listDirectories.workingPath,
        upload: state.files.uploadMultiple
    }
  },
  dispatch => {
    return {
      listFiles: (username, dir) => {
          dispatch(listFiles(username, dir))
      },
      listDirectories: (username, dir) => {
          dispatch(listDirectories(username, dir))
      },
      changeDirectory: (path) => {
        dispatch(changeDirectory(path))
      },
      toggleMenu: (toggle) => {
        dispatch(toggleMenu(toggle))
      },
      uploadFile: (file, username, dir) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)(Inventory)


let styles = {
  hr: {
    visibility: 'hidden'
  },

}