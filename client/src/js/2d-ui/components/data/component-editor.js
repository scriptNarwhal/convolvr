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
import { 
    textAreaStyle,
    basicInputStyle,
    lightboxStyle, 
    modalStyle 
} from '../../styles'

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

    componentWillReceiveProps ( nextProps: Object ) { 

        if ( this.props.itemId != nextProps.itemId || this.props.category != nextProps.category ) {

            if ( nextProps.category != "" && nextProps.itemId != "" )

                this.loadPropertyData( this.props, nextProps)

        }

        const editSourceMatches = nextProps.editSource == nextProps.source

        if ( this.props.activated == false && nextProps.activated == true && editSourceMatches )

            this.setState({
                activated: true
            })
        
        if ( editSourceMatches && this.props.editLoadedItemActivated == false && nextProps.editLoadedItemActivated ) {

            this.loadPropertyData( this.props, nextProps )
            
            this.setState({
                index: nextProps.loadedItemIndex
            })

        }
      
    }

    loadPropertyData( props: Object, nextProps: Object ) {

        if (nextProps.editSource == "entityEdit" || nextProps.editSource == "componentEdit") { // load from entity in inventory

            if (nextProps.loadedItemData) {
                this.setState(nextProps.loadedItemData)
            } else {
                console.warn("missing component action data")
                this.setState({ activated: false })
            }

        } else { // load from inventory

            if (nextProps.components && nextProps.components[nextProps.loadedItemIndex]) {
                this.setState(nextProps.components[nextProps.loadedItemIndex])
            } else {
                console.warn("missing component inventory data")
                this.setState({ activated: false })
            }
        }

        let convolvrProps = this.state.props,
        propsList = []
        Object.keys( convolvrProps ).map(key=> { 
            console.info("saving property ", key); 
            propsList.push({ name: key, data: convolvrProps[key] }) 
        })
        if ( convolvrProps ) {
            this.setState({
                properties: propsList
            })
        }

    }

    componentWillUpdate ( nextProps: Object, nextState: Object ) {

    }

    useTemplate( name: string ) {

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

    handlePropertyAction ( action: string, data: Object, e: any ) {
    
        let index = data.propertyIndex,
            properties = this.state.properties,
            propertyData = properties[index].data
        console.info("handlePropertyAction: propertyData: ", propertyData, properties )
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
        console.info("handleComponentAction: componentData: ", componentData, components )
        if ( action == "Delete" ) {
                
            components.splice( index, 1 )
            this.setState({ components })
                
        } else if (action == "Edit") {

            this.props.editLoadedItem( "componentEdit", this.props.username, "Components", index, componentData)

        }
        
    }

    save () {

        let name = this.state.name,
            newId = -1,
            data = {},
            props = {}

        if ( name == "" )  {

            alert("Name is required.")
            return

        }

        this.state.properties.map( prop => {
            console.log("Prop ", prop)
            props = Object.assign({}, props, prop.data )
        })

        data = {
            id: this.state.id,
            name: this.state.name.toString(),
            position: this.state.position,
            quaternion: this.state.quaternion,
            components: this.state.components,
            props
        }
        console.info("<ComponentEditor> save() data ", data)
        if ( this.props.onSave && this.props.source != "inventory" ) {
            
            this.props.onSave( data )
            
        } else if (this.props.editSource == "inventory" && this.props.source == "inventory" ) {
            
            newId = typeof this.props.components == 'object' ? this.props.components.length : 0
            if ( data.id == -1 ) 

                data.id = newId

            this.props.addInventoryItem( this.props.username, "Components", data )
            
        }

        this.toggleModal()

    }

    validate() {

        let valid = null

        return valid

    }

    toggleModal () {

        if ( this.state.activated && this.props.closeComponentEditor ) {
            this.props.closeComponentEditor()
        } else {
            this.setState({
              id: -1
            })
        }
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
                        <span style={styles.basicInput} title='Position'>
                            <span>Position</span>
                            <VectorInput axis={3} decimalPlaces={2} onChange={ (value, event) => { this.onPositionChange( value, event) }} />
                        </span>
                        <span style={styles.basicInput} title='Rotation'>
                            <span>Rotation</span>
                            <VectorInput axis={4} decimalPlaces={4} onChange={ (value, event) => { this.onRotationChange( value, event) }} />
                        </span>
                        <div>
                            <h4 style={styles.h4}>Properties</h4>
                            <PropertyEditor onSave={ data => this.onSaveProperty( data ) } 
                                            entityEditMode={true}
                                            source={"componentEditor"}
                                            username={ this.props.username }
                                            title={"Add Property"}
                            />
                        </div>
                        <div style={ styles.components }>
                            {
                            this.state.properties.map( (property, i) => {
                                return (
                                <Card clickHandler={ (e, name) => { this.handlePropertyAction("Edit", { propertyIndex: i}, e) } }
                                      onContextMenu={ (name, data, e) => this.handlePropertyAction(name, {...data, propertyIndex: i }, e) }
                                      contextMenuOptions={ this.props.contextMenuOptions }
                                      showTitle={true}
                                      compact={true}
                                      username={this.props.username}
                                      dir={this.props.dir}
                                      category={"Properties"}
                                      title={typeof property == 'object' ? property.name : "Property "+i}
                                      image=''
                                      key={i}
                                />
                                )
                            })
                            }
                        </div>
                        <div>
                            <h4 style={styles.h4}>Components</h4>
                            <ComponentEditor onSave={ data => this.onSaveComponent( data ) } 
                                            entityEditMode={true}
                                            source={"componentEditor"}
                                            username={ this.props.username }
                                            title={"Add Component"}
                            />
                        </div>
                        <div style={ styles.components }>
                            {
                            this.state.components.map( (component, i) => {
                                return (
                                <Card clickHandler={ (e, name) => { this.handleComponentAction("Edit", { componentIndex: i}, e) } }
                                      onContextMenu={ (name, data, e) => this.handleComponentAction(name, {...data, componentIndex: i }, e) }
                                      contextMenuOptions={ this.props.contextMenuOptions }
                                      showTitle={true}
                                      compact={true}
                                      username={this.props.username}
                                      dir={this.props.dir}
                                      category={"Components"}
                                      title={component.name}
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
                <FileButton title={this.props.title} onClick={ () => { this.toggleModal(); this.setState({editMode: false})} } />
            )

        }
        
    }
}

ComponentEditor.defaultProps = {
    title: "New Component",
    source: "inventory",
    entityEditMode: true,
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
        menuOpen: state.app.menuOpen,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.componentEdit.activated,
        filename: state.util.componentEdit.category,
        fileUser: state.util.componentEdit.username,
        instances: state.util.componentEdit.windowsOpen,
        itemId: state.util.componentEdit.itemId,
        components: state.inventory.items.components,
        editLoadedItemActivated: state.util.loadedItemEdit.activated && state.util.loadedItemEdit.category == "Components",
        loadedItemIndex: state.util.loadedItemEdit.index,
        loadedItemData: state.util.loadedItemEdit.data.component,
        editSource: state.util.loadedItemEdit.source.component,
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
      closeComponentEditor: () => {
        dispatch( closeComponentEditor() )
      }
    }
  }
)(ComponentEditor)

let styles = {
    modal: () => {
        return Object.assign({}, modalStyle(isMobile()), {
            maxWidth: '1080px',
            height: '86%',
            left: ! isMobile() ? '72px' : '0px'
          })
    },
    basicInput: basicInputStyle,
    components: {

    },
    h4: {
        display: "inline-block"
    },
    id: {
        marginRight: '0.5em',
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
        width: '40%',
        padding: '0.25em',
        marginBottom: '0.5em',
        background: '#212121',
        border: 'none',
        borderRadius: '2px',
        fontSize: '1em',
        color: 'white'
    },
    textArea: textAreaStyle,
    textInput: {
        paddingLeft: '0.75em'
    },
    body: {

    },
    title: {

    }
}