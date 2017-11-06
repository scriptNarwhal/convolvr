import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import VectorInput from '../vector-input'
import { rgba, rgb } from '../../../util'
import { isMobile } from '../../../config'
import { 
  textAreaStyle,
  lightboxStyle, 
  modalStyle 
} from '../../styles'

class ImportToWorld extends Component {

  constructor () {

    super()

  }

  componentWillMount () {

    this.setState({
      activated: false,
      editMode: false,
      text: "",
      name: "",
      data: {},
      coords: [0,0,0],
      world: "Overworld",
      id: 0
    })

    
  }

  componentWillReceiveProps ( nextProps ) {

    let data = {}
    
        if ( this.props.activated == false && nextProps.activated == true ) {
    
          this.setState({
            activated: true
          })
    
        }

        if ( this.props.itemData == false && nextProps.itemData == true ) 

          this.setState({name: nextProps.itemData.name})
        
  }

  componentWillUpdate ( nextProps, nextState ) {

  }

  handleTextChange (e) {

    this.setState({
      name: e.target.value
    })

  }

  onCoordChange ( value, event ) {

    this.setState({
      coords: value
    })

  }

  handleWorldChange ( event ) {

    this.setState({
      world: event.target.value
    })

  }

  save ( id ) {

    let name = this.state.name,
        itemData = Object.assign({}, this.props.itemData),
        data = {}

    itemData.world = this.props.currentWorld

    this.props.addItemToWorld( this.props.username, "Entities", this.props.itemData.id, this.state.world, this.state.coords.join("x"), itemData )
    this.toggleModal()

  }

  toggleModal () {

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
              <span style={ styles.title }> 
                <span style={{marginRight: '0.5em'}}>Import To World</span> 
                <input type="text" disabled onChange={ (e) => { this.handleTextChange(e) }} style={ styles.text } /> 
              </span>
              <div style={styles.basicInput}>
                Select world to import into
                <select onChange={ e=> this.handleWorldChange(e) }>
                  {
                    this.props.worlds.map( (world, w) => {
                       
                      return (
                        <option key={w}value={world.name}>{world.name}</option>
                      )

                    })
                  }
                </select>
              </div>
              <div style={styles.basicInput}>
                Specify coordinates: <VectorInput axis={3} decimalPlaces={0} onChange={ (value, event) => { this.onCoordChange( value, event) }} />
              </div>
              
            </div>
            <div style={ styles.body }>
              <FileButton title="Add" onClick={ () => { this.save() } } />
              <FileButton title="Cancel" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
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

ImportToWorld.defaultProps = {

}

import { connect } from 'react-redux'
import {
  addItemToWorld
} from '../../../redux/actions/inventory-actions'
import {
    closeImportToWorld
} from '../../../redux/actions/util-actions'

export default connect(
  (state, ownProps) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode,
        currentWorld: state.worlds.current,
        worlds: state.worlds.all,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.importToWorld.activated,
        itemId: state.util.importToWorld.itemId,
        itemData: state.util.importToWorld.itemData,
        dir: state.util.importToWorld.dir
    }
  },
  dispatch => {
    return {
      addItemToWorld: ( userId, category, itemId, world, coords, itemData ) => {
        dispatch( addItemToWorld( userId, category, itemId, world, coords, itemData ) )
      },
      closeImportToWorld: () => {
        dispatch( closeImportToWorld() )
      }
    }
  }
)(ImportToWorld)

let styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
        maxWidth: '1080px',
        left: ! isMobile() ? '72px' : '0px'
      })
  },
  lightbox: lightboxStyle,
  basicInput: {
    marginBottom: '0.5em'
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
    border: 'none',
    borderRadius: '2px',
    fontSize: '1em',
    color: 'white',
  },
  textArea: textAreaStyle,
  body: {

  },
  title: {

  }
}