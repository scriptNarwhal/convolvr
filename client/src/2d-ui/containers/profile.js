import React, { Component } from 'react'
import Shell from '../components/shell'
import { browserHistory } from 'react-router'
import { 
  modalStyle 
} from '../styles'
import { isMobile } from '../../config'

class Profile extends Component {

  constructor () {
    super()
  }

  componentWillMount () {

    let user = this.props.user,
        email = "",
        pass = "",
        name = "",
        data = {},
        id = -1

    if ( user ) {
      email = user.email
      pass = user.password
      name = user.name
      data = user.data || {} 
      id = user.id
    }

    this.setState({
      email,
      pass,
      name,
      data,
      id
    })
  }

  componentWillReceiveProps ( nextProps, nextState ) {

    let user = null

    if ( this.props.user == false && nextProps.user != false ) {

      user = nextProps.user

      console.log("Done Loading User")
      this.setState({
        email: user.email,
        pass: user.password,
        name: user.name,
        data: user.data,
        id: user.id
      })

    }

    if ( this.props.updateFetching && nextProps.updateFetching == false ) {
      alert("Profile Updated.")
      this.props.login( this.state.name, this.state.pass )
    }
    if ( this.props.loginFetching && nextProps.loginFetching == false ) {
      browserHistory.push("/")
    }
  }

  save ( ) {

    let data = this.state.data,
        error = null

    data.profilePicture = this.state.profilePicture
    this.validate( this.state )

    if ( error === null ) {
      if ( this.state.id == -1 ) {
        this.props.login( this.state.name, this.state.pass, this.state.email, data )
      } else {
        this.props.updateUser( this.state.id, this.state.name, this.state.pass, this.state.email, data )
      }
    } else {
      alert( error )
    }
  }

  onAvatarChange( value ) {

    this.setState({
      data: {
        ...this.state.data,
        avatar: value
      }
    })
  }

  updateField( field, e ) {

    this.setState({
      [field]: e.target.value
    })
  }

  validate ( data ) {

    let error = null

    if ( data.name == "" )
      error = "Username is required."
    
    if ( data.email != "" && data.email.indexOf("@") < 0 )
      error = "Email must be valid or left blank."
    
    return error
  }

  upload ( e ) {

    let data = new FormData(),
        username = this.props.user != false ? this.props.user.name : 'public',
        imageURL = ""

    if ( !!e.target.files ) {
      data.append('file', e.target.files[0])
      imageURL = username+"/profile-images/"+e.target.files[0].name.replace(/\s/g, '-')
      this.setState({
        profilePicture: imageURL
      })
      this.props.uploadFile(data, username, "profile-images")
    }
  }
  
  render() {

    let isAdmin = this.props.user.name == 'admin'

    return (
        <Shell className="settings">
          <div style={styles.modal()}>
            <div>
              <h1>Profile</h1>
            </div>
            <div>
            <h3 style={styles.h3}>User Name</h3>
            <div style={styles.col}>
              <span style={{paddingLeft: '1em'}}>
               <input onBlur={ (e)=> this.updateField( "name", e) }
                      defaultValue={ this.state.name }
                      style={styles.textInput} 
                      type='text' 
                      disabled={ this.state.id != -1 }
                />
              </span>
            </div>
            <h3 style={styles.h3}>Email Address</h3>
            <div style={styles.col}>
              <span style={{paddingLeft: '1em'}}>
                <input onBlur={ (e)=> this.updateField( "email", e) }
                       defaultValue={ this.state.email }
                       style={styles.textInput} 
                       type='text' 
                />
              </span>
            </div>
            <h3 style={styles.h3}>Update Password</h3>
            <div style={styles.col}>
              <span style={{paddingLeft: '1em'}}>
                <input onBlur={ (e)=> this.updateField( "pass", e) }
                       defaultValue={ this.state.password }
                       style={styles.textInput} 
                       type='text' 
                />
              </span>
            </div>
          </div>
          <div>
            <h3 style={styles.h3}>Change Profile Image</h3>
            <div style={styles.col}>
              <span style={{paddingLeft: '1em'}}>
                <input onChange={ (e)=> this.upload(e) }
                       style={styles.fileUpload} 
                       type='file' 
                />
              </span>
            </div>
          </div>
          <div>
            <h3 style={styles.h3}>Change 3D Avatar</h3>
            <div style={styles.col}>
              <span style={{paddingLeft: '1em'}}>
                <select onChange={ e=> { this.onAvatarChange( e.target.value )} } >
                  <option value="avatar">default</option>
                  <option value="hero">hero</option>
                  <option value="monster">monster</option>
                  {
                    this.props.entities.map( (ent, i) => {
                      return (
                        <option value={ent.name} key={i}>{ent.name}</option>
                      )
                    })
                  }
                </select>
              </span>
            </div>
          </div>
            <input style={styles.save}
                 type='submit'
                 value={ this.state.id == -1 ? "Create Account" : "Save Settings" }
                 onClick={ e=> this.save()}
            />
          </div>
        </Shell>
    )

  }

}

import { connect } from 'react-redux';
import { sendMessage } from '../../redux/actions/message-actions'
import { uploadFile } from '../../redux/actions/file-actions'
import { 
  updateUser,
  login,
  logOut 
} from '../../redux/actions/user-actions'
import {
  fetchWorlds,
  setCurrentWorld,
  fetchUniverseSettings,
  updateUniverseSettings
} from '../../redux/actions/world-actions'

export default connect(
  (state, ownProps) => {
    return {
        fetchingSettings: state.worlds.fetchingSettings,
        settings: state.worlds.universeSettings,
        worlds: state.worlds.all,
        user: state.users.loggedIn,
        entities: state.inventory.items.entities ?  state.inventory.items.entities : [],
        entitiesFetching: state.inventory.fetching,
        loginFetching: state.users.fetching,
        updateFetching: state.users.updateFetching
    }
  },
  dispatch => {
    return {
      login: (user, pass, email, data) => {
        dispatch(login(user, pass, email, data))
      },
      logOut: () => {
        dispatch( logOut( ) )
      },
      updateUser: ( id, name, pass, email, data ) => {
        dispatch( updateUser( id, name, pass, email, data ) )
      },
      sendMessage: (message, from) => {
          dispatch(sendMessage(message, from))
      },
      setCurrentWorld: (world) => {
          dispatch(setCurrentWorld(world))
      },
      uploadFile: (file, username, dir) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)( Profile )


const styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
        maxWidth: '720px',
        bottom: undefined,
        top: '1em',
        height: '85vh',
        left: '0px'
      })
  },
  textInput: {
    background: "#404040",
    padding: '1em',
    color: "white"
  },
  save: {
    float: 'right',
    marginRight: '2em',
    marginTop: '1em',
    marginBottom: '3em',
    fontSize: '1.25em',
    background: '#2b2b2b',
    color: 'white',
    border: 'none',
    padding: '0.5em',
    borderRadius: '3px',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.54)'
  },
  h3: {
    textAlign: 'left',
    width: '42%',
    fontSize: '14px',
    display: 'inline-block',
    marginLeft: '3%'
  },
  col: {
    width: '55%',
    display: 'inline-block',
  },
  select: {
    padding: '0.5em'
  },
  range: {
    padding: '0.5em'
  },
  admin: {
    marginTop: '3em'
  },
  table: {
    marginLeft: '3em'
  },
  numericLabel: {paddingLeft: '1em', width: '100px', display: 'inline-block'}
}