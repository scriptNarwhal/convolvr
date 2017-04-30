import React, { Component } from 'react'
import Shell from '../shell'

const styles = {
  modal: {
    width: '66.66vh',
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
    marginBottom: '1em',
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
    width: '45%',
    display: 'inline-block'
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
  }
}

class Settings extends Component {
  constructor () {
    this.state = {
      camera: 'fps',
      lighting: 'high',
      aa: 'on',
      postProcessing: 'on',
      defaultWorld: 'overworld',
      welcomeMessage: 'Welcome to Convolvr!',
      floorHeight: 0,
      viewDistance: 0,
      profilePicture: '',
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
      viewDistance: localStorage.getItem("viewDistance") != null ? localStorage.getItem("viewDistance") : 0
    })
    this.props.fetchUniverseSettings()
  }
  componentWillUpdate(nextProps, nextState) {
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
    localStorage.setItem('viewDistance', this.state.viewDistance)
    this.reload()
  }
  updateUniverseSettings () {
    let data = {
      id: 1,
      defaultWorld: this.state.defaultWorld,
      welcomeMessage: this.state.welcomeMessage,
      network: this.state.network
    }
    this.props.updateUniverseSettings(data, this.props.user.Password)
  }
  addServer() {
    let network = this.state.network
    network.push({domain: '', image: ''})
    this.setState({network})
  }
  removeServer(index) {
    let network = this.state.network
    network.splice(index, 1)
    this.setState({network})
  }
  updateServer (index, name, image = '') {
    let network = this.state.network
    network[index].name = name
    network[index].image = image
    this.setState({network})
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
          <h1>Settings</h1>
          <div>
            <h3 style={styles.h3}>Profile Picture</h3>
            <span style={{paddingLeft: '1em'}}>
              <input nChange={ (e)=> this.upload(e) }
                           style={styles.fileUpload} 
                           type='file' 
              />
            </span>
          <div>
            <h3 style={styles.h3}>View Distance</h3>
            <input onBlur={e=> {this.setState({viewDistance: parseInt(e.target.value)})}}
                   style={styles.range}
                   defaultValue={this.state.viewDistance}
                   step={1}
                   type='range'
                   min='-4'
                   max='6'
            />
            <span style={{paddingLeft: '1em'}}>
              {(this.state.viewDistance > 0 ?'+ ':'- ')+this.state.viewDistance} Voxels 
            </span>
          </div>
          <div>
            <h3 style={styles.h3}>Floor Height (VR)</h3>
            <input onBlur={e=> {this.setState({floorHeight: parseInt(e.target.value)})}}
                   style={styles.range}
                   defaultValue={this.state.floorHeight}
                   step={1}
                   type='range'
                   min='-30000'
                   max='20000'
            />
            <span style={{paddingLeft: '1em'}}>
              {this.state.floorHeight} Units
            </span>
          </div>
          <div>
            <h3 style={styles.h3}>Lighting Quality</h3>
            <select onChange={e=> {this.setState({lighting: e.target.value})}}
                    value={ this.state.lighting }
                    style={ styles.select }
            >
              <option value="high">High (recommended)</option>
              <option value="low">Low (mobile devices)</option>
            </select>
          </div>
          <div>
            <h3 style={styles.h3}>Antialiasing</h3>
            <select onChange={e=> {this.setState({aa: e.target.value})}}
                    value={ this.state.aa }
                    style={ styles.select }
            >
              <option value="on">On (recommended)</option>
              <option value="off">Off (for older GPUs)</option>
            </select>
          </div>
          <div>
            <h3 style={styles.h3}>Post Processing</h3>
            <select onChange={e=> {this.setState({postProcessing: e.target.value})}}
                    value={ this.state.postProcessing }
                    style={ styles.select }
            >
              <option value="on">On (Bloom HDR Effect)</option>
              <option value="off">Off (Better Performance)</option>
            </select>
          </div>
          <div>
            <h3 style={styles.h3}>Camera Control Mode</h3>
            <select onChange={e=> { this.setState({camera: e.target.value})}}
                    value={ this.state.camera }
                    style={ styles.select }
            >
              <option value="fps">First Person Camera</option>
              <option value="vehicle">Flight Camera (relative rotation)</option>
            </select>
            <h3 style={styles.h3}>IOT Mode</h3>
            <select onChange={e=> {this.setState({IOTMode: e.target.value})}}
                    value={ this.state.IOTMode }
                    style={ styles.select }
            >
              <option value="off">Off (Recommended)</option>
              <option value="on">On (Only renders after world update)</option>
            </select>
          </div>
          <input style={styles.save}
                 type='submit'
                 value="Save Settings"
                 onClick={ e=> this.save()}
          />
          <br />
          { isAdmin ? (
            <div style={styles.admin}>
              <h2 style={{marginTop: '1em'}}>Admin Settings</h2>
              <div>
                <h3 style={styles.h3}>Default World</h3>
                <select onChange={e=> { this.setState({defaultWorld: e.target.value})}}
                        value={ this.state.defaultWorld }
                        style={ styles.select }
                >
                {
                  this.props.worlds.map( (world, i) => {
                    return (
                      <option value={world.name} key={i}>{world.name}</option>
                    )
                  })
                }
                </select>
              </div>
              <div>
                <h3 style={styles.h3}>Welcome Message</h3>
                <input onBlur={e=> { this.setState({welcomeMessage: e.target.value})}}
                       value={ this.state.welcomeMessage }
                       style={styles.textInput}
                       type='text'
                />
              </div>
              <div style={styles.table}>
                <h3 style={styles.h3}>Manage Network</h3>
                <table>
                  <tr>
                    <td>Domain Name</td>
                    <td></td>
                    <td>
                      <input type='button'
                             value='Add Server'
                             onClick={e=> { this.addServer() }}
                             style={styles.addServer}
                      />
                    </td>
                  </tr>
                  <tr>
                    </tr>
                    {
                      this.state.network.map((domain, index)=>{
                        return (
                          <tr key={index}>
                            <td>
                              <input type='text'
                                     style={styles.domainName}
                                     value={domain.name}
                                     onBlur={e=> this.updateServer(index, e.target.value)}
                              />     
                            </td>
                            <td>{
                              domain.image != '' ? ( // make this editable later
                                <img src={`/data/public/${domain.image}`} 
                                     style={styles.domainImage}
                                     title={domain.name}
                                     alt={domain.name}
                                />
                              ) : ''}
                            </td>
                            <td>
                              <input type='button'
                                     value='Remove'
                                     onClick={e=> { this.removeServer(index) }}
                                     style={styles.addServer}
                              />
                            </td>
                          </tr>
                        )
                      })
                    }
                </table>
              </div>
              <input style={styles.save}
                     type='submit'
                     value="Save Admin Settings"
                     onClick={ e=> this.updateUniverseSettings()}
              />
            </div>
          ): ""}
          </div>
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
)(Settings)
