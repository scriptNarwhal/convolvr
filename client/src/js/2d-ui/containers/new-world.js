import React, { Component } from 'react'
import Shell from '../shell'

const styles = {
  innerLogin: {
    width: '55vh',
    height: '80vh',
    minWidth: '360px',
    margin: 'auto',
    display: 'block',
    position: 'relative',
    top: '6vh',
    left: '0px',
    right: '0px',
    bottom: '5vh',
    borderTop: '0.8vh solid rgb(43, 43, 43)',
    background: 'rgb(27, 27, 27)'
  },
  title: {
    fontSize: "4vh",
    paddingTop: "3.5vh",
    paddingBottom: "5vh"
  },
  form: {
    overflowY: 'auto',
    height: '80%',
    overflowX: 'hidden'
  },
  label: {
    marginRight: "1em",
    color: 'rgba(255, 255, 255, 0.85)'
  },
  input: {
    background: 'transparent',
    color: 'white',
    padding: '0.5em',
    border: '2px solid rgba(255,255,255,0.25)'
  },
  username: {
    marginBottom: "1em"
  },
  option: {
    marginBottom: "0.75em"
  },
  go: {

  },
  submit: {
    fontSize: "5vh",
    color: "#929292",
    background: "rgb(255, 255, 255)",
    borderRadius: "0.2vh",
    border: "rgb(107, 104, 104) 0.4vh solid",
    cursor: "pointer"
  },
  signInButton: {
    fontSize: '1em',
    marginRight: '1em'
  },
  fileUpload: {
    marginRight: '1em'
  }
}

export default class NewWorld extends Component {
  constructor () {
    super()
  }
  componentWillMount() {
    this.state = {
      name: "",
      skyType: "shader",
      layers: [],
      photosphere: '',
      red: 1.0,
      green: 1.0,
      blue: 1.0,
      intensity: 0.75,
      terrainType: 'both',
      terrainColor: 0x404040,
      flatness: 2,
      entities: true,
      structures: true,
      npcs: true,
      tools: true,
      vehicles: true,
    }
  }

  createWorld() {
    let
      lightColor = [parseFloat(this.state.red), parseFloat(this.state.green), parseFloat(this.state.blue)],
      data = {
      id: 0,
      name: this.state.name,
      sky: {
        skyType: this.state.skyType,
        red: lightColor[0],
        green: lightColor[1],
        blue: lightColor[2],
        layers: this.state.layers,
        photosphere: this.state.photosphere
      },
      light: {
        color: 0x1000000 + (Math.floor(lightColor[0] * 255) << 16) + (Math.floor(lightColor[1] * 255) << 8) + Math.floor(lightColor[2] * 255),
        intensity: parseFloat(this.state.intensity),
        angle: 2.0,
        ambientColor: 0x000000
      },
      terrain: {
        type: this.state.terrainType,
        height: 20000,
        color: this.state.terrainColor,
        flatness: parseFloat(this.state.flatness),
        decorations: ""
      },
      spawn: {
        entities: this.state.entities,
        structures: this.state.structures,
        npcs: this.state.npcs,
        tools: this.state.tools,
        vehicles: this.state.vehicles
      }
    }
    if (this.state.name != "") {
      this.props.createWorld(data)
    } else {
      alert("World name must be entered.")
    }
  }
  onSkyTypeChange (e) {
    let value = e.target.value
    this.setState({
      skyType: e.target.value
    })
  }
  onTerrainTypeChange (e) {
    let value = e.target.value
    this.setState({
      terrainType: e.target.value
    })
  }
  upload (e) {
    let data = new FormData(),
        username = this.props.loggedInUser != false ? this.props.loggedInUser.name : 'public'
    data.append('file', e.target.files[0])
    this.setState({
      photosphere: username+"/"+e.target.files[0].name
    })
    this.props.uploadFile(data, username, "")
  }
  render() {
    return (
        <Shell className="login">
          <div style={styles.innerLogin}>
            <div style={styles.title}>
              New World
            </div>
            <div style={styles.form}>
              <div style={styles.username}>
                <span style={styles.label}>World Name</span>
                <input name="convolvr-login"
                       autoComplete="false"
                       ref={(input) => { this.nameInput = input }}
                       type='text'
                       onBlur={(e)=>{ this.setState({name: e.target.value }) }}
                       style={styles.input}
                />
              </div>
              <div style={styles.option}>
                <span style={styles.label}>Skybox Type</span>
                <select onChange={ e=> { this.onSkyTypeChange(e) }}>
                  <option value="shader">Gradient Sky</option>
                  <option value="photosphere">Photosphere</option>
                </select>
              </div>
              {
                this.state.skyType == 'photosphere' ? (
                  <div style={styles.option}>
                    <span style={styles.label}>Skybox Photosphere</span>
                    <input style={styles.fileUpload} type='file' onChange={ (e)=> this.upload(e) } />
                  </div>
                ) : ""
              }
              <div style={styles.option}>
                <span style={styles.label}>Light Color / Red</span>
                    <input type='range' min='0' max='1' step='0.001'  onChange={e=> { this.setState({red: e.target.value })}}/>
                </div>
                <div style={styles.option}>
                  <span style={styles.label}>Light Color / Green</span>
                    <input type='range' min='0' max='1' step='0.001'  onChange={e=> { this.setState({green: e.target.value })}}/>
                </div>
                <div style={styles.option}>
                  <span style={styles.label}>Light Color / Blue</span>
                  <input type='range' min='0' max='1' step='0.001' onChange={e=> { this.setState({blue: e.target.value })}} />
                </div>
              <div style={styles.option}>
                <span style={styles.label}>Light Intensity</span>
                  <input type='range' min='0' max='1' step='0.001'  onChange={e=> { this.setState({intensity: e.target.value })}}/>
              </div>
              <div style={styles.option}>
                <span style={styles.label}>Terrain Type</span>
                <select onChange={ e=> { this.onTerrainTypeChange(e) }}>
                  <option value="both">Voxels + Ground Plane</option>
                  <option value="voxels">Voxels Only</option>
                  <option value="plane">Ground Plane Only</option>
                  <option value="empty">Empty Space</option>
                </select>
              </div>
              <div style={styles.option}>
                <span style={styles.label}>Terrain Flatness</span>
                  <input type='range' min='1' max='16' step='0.1'  onChange={e=> { this.setState({flatness: e.target.value })}}/>
              </div>


              <div style={styles.go}>
                <input type="button"
                        value="Create"
                        style={styles.signInButton}
                        onClick={e=> { this.createWorld() } }
                />
              </div>
            </div>
          </div>
        </Shell>
    )
  }
}

NewWorld.defaultProps = {
}

import { connect } from 'react-redux'
import { createWorld } from '../../redux/actions/world-actions'
import { uploadFile } from '../../redux/actions/file-actions'
export default connect(
  state => {
    return {
      tools: state.tools,
      users: state.users,
      loggedInUser: state.users.loggedIn,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode,
      uploading: state.files.upload.fetching
    }
  },
  dispatch => {
    return {
      createWorld: (data) => {
        dispatch(createWorld(data))
      },
      uploadFile: (file, username, dir) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)(NewWorld)
