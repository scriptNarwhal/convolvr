import React, { Component } from 'react'
import Shell from '../components/shell'

const styles = {
  modal: {
    width: '100%',
    maxWidth: '800px',
    height: '100%',
    minWidth: '360px',
    margin: 'auto',
    display: 'block',
    position: 'relative',
    top: '2vh',
    left: '0px',
    right: '0px',
    borderTop: '0.8vh solid rgb(43, 43, 43)',
    background: 'rgb(27, 27, 27)'
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
  textInput: {

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

class Profile extends Component {

  constructor () {
    this.state = {
      camera: 'fps',
      lighting: 'high',
      aa: 'on',
      postProcessing: 'on',
      defaultWorld: 'overworld',
      welcomeMessage: 'Welcome to Convolvr!',
      leapMode: "hybrid",
      floorHeight: 0,
      viewDistance: 0,
      profilePicture: '',
      manualLensDistance: 0,
      network: [],
      IOTMode: false
    }
  }

  componentWillMount () {

    this.setState({
      camera: localStorage.getItem("camera") || 'fps',
      lighting: localStorage.getItem("lighting") || 'high',
      postProcessing: localStorage.getItem("postProcessing") || 'off',
      vrMovement: localStorage.getItem("vrMovement") || 'stick',
      aa: localStorage.getItem("aa") || "on",
      floorHeight: parseInt(localStorage.getItem("floorHeight") || 1),
      IOTMode: localStorage.getItem("IOTMode") || 'off',
      leapMode: localStorage.getItem("leapMode") || "hybrid",
      viewDistance: localStorage.getItem("viewDistance") != null ? localStorage.getItem("viewDistance") : 0,
      manualLensDistance: localStorage.getItem("manualLensDistance") != null ? localStorage.getItem("manualLensDistance") : 0
    })
    this.props.fetchUniverseSettings()

  }

  componentWillReceiveProps ( nextProps, nextState ) {

    if (this.props.fetchingSettings == true && nextProps.fetchingSettings == false && nextProps.settings != null) {

      console.log("Done Loading Universe Settings")
      this.setState({
        defaultWorld: nextProps.settings.defaultWorld,
        welcomeMessage: nextProps.settings.welcomeMessage,
        network: nextProps.settings.network || []
      })

    }

  }

  reload () {

    window.location.href = window.location.href

  }

  save () {

    localStorage.setItem('camera', this.state.camera)
    localStorage.setItem('lighting', this.state.lighting)
    localStorage.setItem('aa', this.state.aa)
    localStorage.setItem('postProcessing', this.state.postProcessing)
    localStorage.setItem('vrMovement', this.state.vrMovement) 
    localStorage.setItem('IOTMode', this.state.IOTMode)
    localStorage.setItem('floorHeight', this.state.floorHeight)
    localStorage.setItem( 'leapMode', this.state.leapMode )
    localStorage.setItem('viewDistance', this.state.viewDistance)
    localStorage.setItem('manualLensDistance', this.state.manualLensDistance)
    this.reload()
    
  }

  upload (e) {
    let data = new FormData(),
        username = this.props.loggedInUser != false ? this.props.loggedInUser.name : 'public'
    data.append('file', e.target.files[0])
    this.setState({
      profilePicture: username+"/"+e.target.files[0].name.replace(/\s/g, '-')
    })
    this.props.uploadFile(data, username, "")
  }
  
  render() {

    let isAdmin = this.props.user.name == 'admin'

    return (
        <Shell className="settings">
          <div style={styles.modal}>
            <div>
              <h1>Profile Settings</h1>
            </div>
            <input style={styles.save}
                 type='submit'
                 value="Save Settings"
                 onClick={ e=> this.save()}
            />
          </div>
        </Shell>
    )

  }

}


import { connect } from 'react-redux';
import {
    sendMessage
} from '../../redux/actions/message-actions'
import { uploadFile } from '../../redux/actions/file-actions'
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
        user: state.users.loggedIn
    }
  },
  dispatch => {
    return {
      sendMessage: (message, from) => {
          dispatch(sendMessage(message, from))
      },
      setCurrentWorld: (world) => {
          dispatch(setCurrentWorld(world))
      },
      updateUniverseSettings: (data, password) => {
          dispatch(updateUniverseSettings(data, password))
      },
      fetchUniverseSettings: () => {
        dispatch(fetchUniverseSettings())
      },
      uploadFile: (file, username, dir) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)( Profile )
