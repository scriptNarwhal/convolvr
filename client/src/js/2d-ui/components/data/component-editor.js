import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import FileButton from './file-button'
import Card from '../card'
import {
    rgba,
    rgb
} from '../../../util'
import { isMobile } from '../../../config'
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
            id: -1,
            name: "",
            components: [],
            properties: [],
            position: [0,0,0],
            quaternion: [0,0,0,1]
        })
        
        if ( !this.props.itemId )

            this.useTemplate("Wireframe Box")
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

            if ( this.props.editSource == "entityEdit" ) { // load from entity in inventory

                if ( nextProps.loadedItemData ) {
                    this.setState( nextProps.loadedItemData )                    
                } else {
                    alert("missing component action data")
                    this.setState({activated: false})
                }
                
            } else { // load from inventory

                if (nextProps.components && nextProps.components[ nextProps.loadedItemIndex ]) {
                    this.setState( nextProps.components[ nextProps.loadedItemIndex ])
                } else {
                    alert("missing component inventory data")
                    this.setState({activated: false})
                }
            }

            let convolvrProps = this.state.props
            if ( convolvrProps ) {
                this.setState({
                    properties: Object.keys( convolvrProps ).map(key=> { return { name: key, data: convolvrProps[key] } })
                })
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

        switch ( name ) {

            case "Wireframe Box":
                template = {
                    name: "Wireframe Box",
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
                    name: "Box2",
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

    handlePropertyAction ( action, data, e ) {
    
        let index = data.propertyIndex,
            properties = this.state.properties,
            propertyData = properties[index]

        if ( action == "Delete" ) {

            properties.splice( index, 1 )
            this.setState({ properties })

        } else if ( action == "Edit" ) {

            this.props.editLoadedItem( "componentEdit", this.props.username, "Properties", index, propertyData )

        }
    
    }

    handleComponentAction ( action, data, e ) {
        
        let index = data.componentIndex,
            components = this.state.components,
            componentData = components[index]
    
        if ( action == "Delete" ) {
                
            components.splice( index, 1 )
            this.setState({ components })
                
        } else if (action == "Edit") {

            this.props.editLoadedItem( "componentEdit", this.props.username, data, index, componentData)

        }
        
    }

    save () {

        let name = this.state.name,
            data = {},
            props = {}

        if ( name == "" )  {

            alert("Name is required.")
            return

        }

        this.state.properties.map( prop => {
            props = Object.assign({}, props, prop.data )
        })

        data = {
            id: this.state.id,
            name: this.state.name,
            position: this.state.position,
            quaternion: this.state.quaternion,
            components: this.state.components,
            props
        }

        if ( this.props.onSave ) {
            
            this.props.onSave( data )
            
        } else {
            
            this.props.addInventoryItem( this.props.username, "Components", data )
            
        }

        this.toggleModal()

    }

    validate() {

        let valid = null

        return valid

    }

    toggleModal () {

        this.state.activated && this.props.closeComponentEditor()
        this.setState({
          activated: !this.state.activated
        })

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
            id: parseInt(e.target.value)
        })

    }

    onSaveProperty( data ) {

        let properties = []

        properties = this.state.properties

        if ( data.id <= -1 )
        
            data.id = this.state.properties.length
              
            
        properties.push( data )

        this.setState({
            properties
        })

    }

    onSaveComponent( data ) {

        let components = []

        components = this.state.components

        if ( data.id <= -1 )

            data.id = this.state.components.length
        

        components.push(data)

        this.setState({
            components
        })

    }

    render() {

        if ( this.state.activated ) {

            return (
            <div style={ styles.lightbox }>
                <div style={ styles.modal() } >
                    <div style={ styles.header }>
                    <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Component Edit</span> 
                        <input defaultValue={ this.state.name } type="text" onChange={ (e) => { this.onNameChange(e) }} style={ styles.text } /> 
                    </span>
                    </div>
                    <div style={ styles.body }>
                        <span style={styles.basicInput} title='ID'>
                        <span style={styles.id}>ID</span> 
                        <input type="numeric" step="1" style={styles.textInput} defaultValue={this.state.id} disabled />
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
                        <div style={ styles.components }>
                            {
                            this.state.properties.map( (property, i) => {
                                return (
                                <Card clickHandler={ (e) => {
                                        console.log(e, Object.keys(property)[0], "clicked")
                                        
                                        }}
                                        onContextMenu={ (name, data, e) => this.handlePropertyAction(name, {...data, componentIndex: i }, e) }
                                        contextMenuOptions={ this.props.contextMenuOptions }
                                        showTitle={true}
                                        username={this.props.username}
                                        dir={this.props.dir}
                                        category={"Properties"}
                                        title={property.name}
                                        image=''
                                        key={i}
                                />
                                )
                            })
                            }
                        </div>
                        <PropertyEditor onSave={ data => this.onSaveProperty( data ) } 
                                        username={ this.props.username }
                        />
                        <h4>Components</h4>
                        <div style={ styles.components }>
                            {
                            this.state.components.map( (component, i) => {
                                return (
                                <Card clickHandler={ (e) => {
                                        console.log(e, component.name, "clicked")
                                        
                                        }}
                                        onContextMenu={ (name, data, e) => this.handleComponentAction(name, {...data, componentIndex: i }, e) }
                                        contextMenuOptions={ this.props.contextMenuOptions }
                                        showTitle={true}
                                        username={this.props.username}
                                        dir={this.props.dir}
                                        category={"Properties"}
                                        title={component.name}
                                        image=''
                                        key={i+'.2'}
                                />
                                )
                            })
                            }
                        </div>
                        <ComponentEditor onSave={ data => this.onSaveComponent( data ) } 
                                         username={ this.props.username }
                        />
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
    contextMenuOptions: [
        { name: "Edit" },
        { name: "Delete"}
    ]
}

import { connect } from 'react-redux'
import {
    getInventory,
    addInventoryItem,
    updateInventoryItem
} from '../../../redux/actions/inventory-actions'
import {
    closeComponentEditor,
    launchEditLoadedItem
} from '../../../redux/actions/util-actions'

export default connect(
  (state, ownProps) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.routing.locationBeforeTransitions.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.componentEdit.activated,
        filename: state.util.componentEdit.category,
        fileUser: state.util.componentEdit.username,
        itemId: state.util.componentEdit.itemId,
        components: state.inventory.items.components,
        editLoadedItemActivated: state.util.loadedItemEdit.activated && state.util.loadedItemEdit.category == "Components",
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
      closeComponentEditor: () => {
        dispatch( closeComponentEditor() )
      }
    }
  }
)(ComponentEditor)

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
    basicInput: {
        display: 'block',
        marginBottom: '0.5em'
    },
    components: {

    },
    id: {
        marginRight: '0.5em',
    },
    lightbox: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999999999,
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
    textInput: {
        paddingLeft: '0.75em'
    },
    body: {

    },
    title: {

    }
}