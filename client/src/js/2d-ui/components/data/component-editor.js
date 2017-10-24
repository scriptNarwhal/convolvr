import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import {
    rgba,
    rgb
} from '../../../util'
import PropertyEditor from './property-editor'
import VectorInput from '../vector-input'

class ComponentEditor extends Component {

    constructor () {
        super()
    }

    componentWillMount () {

        this.setState({
            activated: false,
            text: "",
            name: "",
            components: [],
            properties: []
        })

        if ( !!this.props.fileURL )

        this.props.readText( this.props.fileURL, this.props.username, this.props.cwd.join("/") )
        
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
            break;
            case "Box2":
                template = {
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
            break;

        }

        this.setState( template )

        return JSON.stringify(template)

    }

    handleContextAction ( action, data, e ) {
    
        let index = data.componentIndex

        if ( action == "Delete" ) {



        } else if ( action == "Edit" ) {



        }
    
    }

    save () {

        let name = this.state.name,
            dir = this.props.activated ? this.props.dir : this.props.cwd.join("/") 

        if ( name != "" ) {

            //this
            this.toggleModal()

        } else {

            alert("Name is required.")

        }

    }

    validate() {

        let valid = null

        return valid

    }

  toggleModal () {

    this.setState({
      activated: !this.state.activated
    })
    this.props.closeComponentEditor()

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

    onNameChange( e ) {

        this.setState({
            name: e.target.value
        })

    }

    onIdChange( e ) {
        
        this.setState({
            id: e.target.value
        })

    }

    render() {

        if ( this.state.activated ) {

            return (
            <div style={ styles.lightbox }>
                <div style={ styles.modal } >
                    <div style={ styles.header }>
                    <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Component Edit</span> 
                        <input defaultValue={ this.state.name } type="text" onChange={ (e) => { this.onNameChange(e) }} style={ styles.text } /> 
                    </span>
                    </div>
                    <div style={ styles.body }>
                        <span style={styles.basicInput} title='ID'>
                            <span>ID</span>
                            <input type="text" style={styles.textInput} defaultValue={this.state.name} onChange={ e=> { this.onIdChange(e) }} />
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
                        <h4>Properties</h4>
                        <PropertyEditor 
                        
                        />
                        <div style={ styles.components }>
                            {
                            this.state.properties.map( (property, i) => {
                                return (
                                <Card clickHandler={ (e) => {
                                        console.log(e, opt.name, "clicked")
                                        
                                        }}
                                        onContextMenu={ (name, data, e) => this.handleContextAction(name, {...data, componentIndex: i }, e) }
                                        contextMenuOptions={ this.props.contextMenuOptions }
                                        showTitle={true}
                                        username={this.props.username}
                                        dir={this.props.dir}
                                        category={"Properties"}
                                        title={opt.name}
                                        image=''
                                        key={i}
                                />
                                )
                            })
                            }
                        </div>
                        <h4>Components</h4>
                        <ComponentEditor 
                        
                        />
                        <div style={ styles.components }>
                            {
                            this.state.components.map( (component, i) => {
                                return (
                                <Card clickHandler={ (e) => {
                                        console.log(e, opt.name, "clicked")
                                        
                                        }}
                                        onContextMenu={ (name, data, e) => this.handleContextAction(name, {...data, componentIndex: i }, e) }
                                        contextMenuOptions={ this.props.contextMenuOptions }
                                        showTitle={true}
                                        username={this.props.username}
                                        dir={this.props.dir}
                                        category={"Properties"}
                                        title={opt.name}
                                        image=''
                                        key={i+'.2'}
                                />
                                )
                            })
                            }
                        </div>
                    <FileButton title="Save" onClick={ () => { this.save() } } />
                    <FileButton title="Cancel" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
                    </div>
                </div>
                </div>
            )

        } else {

            return (
                <FileButton title="New Component" onClick={ () => { this.toggleModal() } } />
            )

        }
        
    }
}

ComponentEditor.defaultProps = {

}

import { connect } from 'react-redux'
import {
    toggleMenu
} from '../../../redux/actions/app-actions'
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
    closeComponentEditor
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
        activated: state.util.componentEdit.activated,
        filename: state.util.componentEdit.category,
        fileUser: state.util.componentEdit.username,
        itemId: state.util.componentEdit.itemId,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      readText: (filename, username, dir) => {
        dispatch( readText (filename, username, dir) )
      },
      writeText: (text, filename, username, dir) => {
        dispatch( writeText (text, filename, username, dir) )
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
      closeComponentEditor: () => {
        dispatch( closeComponentEditor() )
      },
      toggleMenu: (force) => {
          dispatch(toggleMenu(force))
      }
    }
  }
)(ComponentEditor)

let styles = {
    modal: {
        width: '50%',
        maxWidth: '729px',
        minWidth: '320px',
        height: '480px',
        padding: '0.25em',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        background: rgb(38, 38, 38),
        borderTop: '0.2em solid'+ rgba(255, 255, 255, 0.06)
    },
    basicInput: {
        display: 'block'
    },
    components: {

    },
    lightbox: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999999999,
        background: rgba(0, 0, 0, 0.8)
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