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

    this.refreshInventory()

    this.setState({
      
    })

  }

  componentWillReceiveProps ( nextProps ) {

    let userNameChanged = nextProps.username != this.props.username,
        inventoryUpdated = this.props.inventoryFetching && nextProps.inventoryFetching == false

    if ( inventoryUpdated )

      this.refreshInventory()

  }

  refreshInventory ( opts ) {

    this.props.getInventory(this.props.username, "Entities")
    this.props.getInventory(this.props.username, "Components")
    this.props.getInventory(this.props.username, "Properties")

  }

  componentWillUpdate (nextProps, nextState) {


  }

  onContextAction ( name, data, e ) {
    
        switch ( name ) {
    
          case "Add To World":
            this.props.launchImportToWorld( this.props.username, data.itemIndex, data.itemData )
          break;
          case "Edit":
            this.props.editLoadedItem( data.source, this.props.username, data.category, data.itemIndex, data.itemData )
          break;
          case "Export JSON":
            this.props.launchInventoryExport( this.props.username, data.category, data.itemId, data.itemIndex, data.itemData )
          break;
    
        }
    
      }

  render() {

    return (
        <Shell className="data-view" 
               style={ isMobile() ? { paddingTop: '60px' } : { paddingTop: '0px' } }
               innerStyle={ { paddingTop: isMobile() ? '72px' : 0, paddingLeft: isMobile() ? '10px' : '72px' }  }       
        >
        {
          false == this.props.inventoryFetching ? [[this.props.inventoryEntities,   "Entities"  ], 
           [this.props.inventoryComponents, "Components"], 
           [this.props.inventoryProperties, "Properties"]].map( (inventorySet, i) => (
            <InventoryList onAction={ (name, data, e) => {
                            let actionData = {
                              ...data, 
                              source: "inventory", 
                              category: inventorySet[1], 
                              itemIndex: data.itemIndex,
                              itemId: inventorySet[0][ data.itemIndex ].id, 
                              itemData: inventorySet[0][ data.itemIndex ] 
                            }
                            console.info("<InventoryList> onAction ", actionData)
                            this.onContextAction(name, actionData, e) 
                           }}
                           options={ inventorySet[0] }
                           username={ this.props.username }
                           style={{zIndex: 9999}}
                           category={ inventorySet[1] }
                           key={i}
            />
           )) : ""
        }
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
import {
  launchEditLoadedItem,
  launchInventoryExport,
  launchImportToWorld
} from '../../redux/actions/util-actions'

export default connect(
  (state, ownProps) => {
    return {
        loggedIn: state.users.loggedIn,
        username: state.users.loggedIn != false ? state.users.loggedIn.name : "public",
        vrMode: state.app.vrMode,
        inventoryEntities: state.inventory.items.entities,
        inventoryComponents: state.inventory.items.components,
        inventoryProperties: state.inventory.items.properties,
        inventoryFetching: state.inventory.fetching,
        workingPath: state.files.listDirectories.workingPath,
        upload: state.files.uploadMultiple
    }
  },
  dispatch => {
    return {
      launchImportToWorld: (username, index, data) => {
        dispatch( launchImportToWorld(username, index, data))
      },
      launchInventoryExport: (username, category, itemId, itemIndex, itemData) => {
        dispatch( launchInventoryExport(username, category, itemId, itemIndex, itemData))
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
      removeInventoryItem: (userId, category, itemId) => {
        dispatch(removeInventoryItem(userId, category, itemId))
      },
      uploadFile: (file, username, dir) => {
        dispatch(uploadFile(file, username, dir))
      },
      editLoadedItem: ( source, username, category, index, data ) => {
        dispatch(launchEditLoadedItem( source, username, category, index, data ))
      },
    }
  }
)(Inventory)


let styles = {
  hr: {
    visibility: 'hidden'
  },

}