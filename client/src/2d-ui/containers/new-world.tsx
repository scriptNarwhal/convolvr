import * as React from "react"; import { Component } from "react";
import Shell from '../components/shell'
import { 
  modalStyle 
} from '../styles'
import { isMobile } from '../../config'

class NewSpace extends Component<any, any> {

  private nameInput: any;
  private descriptionInput: any;

  componentWillMount() {
    this.setState({
      name: "",
      userName: "space",
      skyType: "shader",
      layers: [],
      photosphere: '',
      protected: false,
      red: 1.0,
      green: 1.0,
      blue: 1.0,
      intensity: 0.75,
      lightPitch: 1.64,
      lightYaw: 1.0,
      gravity: 1.0,
      terrainType: 'both',
      terrainColor: 0x404040,
      turbulentTerrain: true,
      highAltitudeGravity: false,
      flatness: 2,
      flatAreas: true,
      entities: true,
      structures: true,
      pylons: true,
      roads: true,
      npcs: false,
      tools: false,
      vehicles: false,
      orbs: false,
      rocks: false,
      pyramids: true,
      columns: false,
      wheels: false,
      nets: false
    })
  }

  createSpace() {
    let lightColor = [ parseFloat(this.state.red), parseFloat(this.state.green), parseFloat(this.state.blue) ],
        data: any = {
          id: 0,
          name: this.state.name,
          description: this.state.description,
          protected: this.state.protected,
          tags: [],
          gravity: this.state.gravity,
          highAltitudeGravity: this.state.highAltitudeGravity,
          sky: {
            skyType: this.state.skyType,
            red: lightColor[0],
            green: lightColor[1],
            blue: lightColor[2],
            layers: this.state.layers,
            photosphere: this.state.photosphere
          },
          light: {
            color: (Math.floor(lightColor[0] * 255) << 16) + (Math.floor(lightColor[1] * 255) << 8) + Math.floor(lightColor[2] * 255),
            intensity: parseFloat(this.state.intensity),
            pitch: parseFloat(this.state.lightPitch),
            yaw: parseFloat(this.state.lightYaw),
            ambientColor: 0x000000
          },
          terrain: {
            type: this.state.terrainType,
            height: 10,
            color: this.state.terrainColor,
            turbulent: this.state.turbulentTerrain,
            flatness: parseFloat(this.state.flatness),
            flatAreas: this.state.flatAreas,
            decorations: ""
          },
          spawn: {
            entities: this.state.entities,
            structures: this.state.structures,
            roads: this.state.roads,
            trees: this.state.trees,
            npcs: this.state.npcs,
            tools: this.state.tools,
            vehicles: this.state.vehicles,
            orbs: this.state.orbs,
            rocks: this.state.rocks,
            columns: this.state.columns,
            pyramids: this.state.pyramids,
            wheels: this.state.wheels,
            nets: this.state.nets
          }
      }

    data.userName = this.props.loggedInUser != false ? this.props.loggedInUser.name : 'space' // mark as public / not tied to user if no userName
    data.userId = this.props.loggedInUser != false ? this.props.loggedInUser.id : -1
    if (this.state.name != "" || this.state.description == "") {
      this.props.createSpace( data )
    } else {
      alert("Name & Description are required.")
    }
  }
  onToggle( group: string, which: string, e: any ) {
    let value = e.target.value;

    this.setState({
      [which]: value == 'yes' ? true : false
    })
  }
  onSkyTypeChange (e: any) {
    let value = e.target.value
    this.setState({
      skyType: e.target.value
    })
  }
  onTerrainTypeChange (e: any) {
    let value = e.target.value
    this.setState({
      terrainType: e.target.value
    })
  }
  onToggleTurbulentTerrain (e: any) {
    let value= e.target.value
    this.setState({
      turbulentTerrain: value == 'yes' ? true : false
    })
  }
  onToggleFlatAreas ( e: any ) {
    let value = e.target.value
    this.setState({
      flatAreas: value == 'yes' ? true : false
    })
  }
  onToggleGravity (e: any) {
    let value= e.target.value
    this.setState({
      gravity: value == 'yes' ? 1.0 : 0.0
    })
  }
  onToggleProtected (e: any) {
    let value= e.target.value
    this.setState({
      protected: value == 'yes' ? true : false
    })
  }
  onToggleHighAltitudeGravity (e: any) {
    let value = e.target.value
    this.setState({
      highAltitudeGravity: value == 'yes' ? true : false
    })
  }
  upload (e: any) {
    let data = new FormData(),
        username = this.props.loggedInUser != false ? this.props.loggedInUser.name : 'public'
    data.append('file', e.target.files[0])
    this.setState({
      photosphere: username+"/"+e.target.files[0].name.replace(/\s/g, '-')
    })
    this.props.uploadFile(data, username, "")
  }

  render() {
    return (
        <Shell htmlClassName="login">
          <div style={styles.modal()}>
            <div style={styles.title}>
              Create New Space
            </div>
            <table className="table new-world" style={{ paddingLeft: "1em", width: "95%" }}>
              <tbody>
              <tr>
                <td>Space Name</td>
                <td>
                  <input autoComplete="false"
                         key={"worldName"}
                         ref={(input) => { this.nameInput = input }}
                         type='text'
                         onBlur={(e)=>{ this.setState({name: e.target.value }) }}
                         style={ Object.assign({}, styles.input, styles.textInput) }
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Space Description</td>
                <td>
                  <input autoComplete="false"
                         key={"worldDescription"}
                         ref={(input) => { this.descriptionInput = input }}
                         type='text'
                         onBlur={(e)=>{ this.setState({description: e.target.value }) }}
                         style={ Object.assign({}, styles.input, styles.textInput) }
                  />
                  </td>
              </tr>
              <tr>
                  <td>Write Protected?</td>
                  <td>
                  <select onChange={ (e: any)=> { this.onToggleProtected(e) }}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  </td>
              </tr>
              <tr>
                <td>Skybox Type</td>
                <td>
                  <select onChange={ (e: any)=> { this.onSkyTypeChange(e) }}>
                    <option value="shader">Gradient Sky</option>
                    <option value="photosphere">Photosphere</option>
                  </select>
                </td>
                <td>
                  {
                  this.state.skyType == 'photosphere' ? (
                    <div style={styles.option}>
                      <span style={styles.label as any}>Skybox Photosphere</span>
                      <span style={styles.setting as any}>
                        <input style={styles.fileUpload} type='file' onChange={ (e)=> this.upload(e) } />
                      </span>
                    </div>
                  ) : ""
                }
                </td>
              </tr>
              <tr>
                <td>Light Intensity</td>
                <td>
                  <input type='range' min='0' max='2' step='0.001' onChange={(e: any)=> { this.setState({intensity: e.target.value })}}/> { this.state.intensity }
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Light Direction</td>
                <td>
                  Pitch <input type='range' min='0' max='3.14' step='0.001' onChange={(e: any)=> { this.setState({lightPitch: e.target.value })}}/> { this.state.lightPitch }
                </td>
                <td>
                  Yaw <input type='range' min='0' max='6.28' step='0.001' onChange={(e: any)=> { this.setState({lightYaw: e.target.value })}}/> { this.state.lightYaw }
                </td>
              </tr>
               <tr>
                <td>Light Color</td>
                <td>Red</td>
                <td>Green</td>
                <td>Blue</td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type='range' min='0' max='2' step='0.001'  onChange={(e: any)=> { this.setState({red: e.target.value })}}/> 
                  <span>{ this.state.red }</span>
                  </td>
                <td>
                  <input type='range' min='0' max='2' step='0.001'  onChange={(e: any)=> { this.setState({green: e.target.value })}}/> 
                  <span>{ this.state.green }</span>
                </td>
                <td>
                  <input type='range' min='0' max='2' step='0.001' onChange={(e: any)=> { this.setState({blue: e.target.value })}} /> 
                  <span>{ this.state.blue }</span>
                </td>
              </tr>
               <tr>
                 <td>Terrain Color</td>
                <td>Red</td>
                <td>Green</td>
                <td>Blue</td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <input type='range' min='0' max='2' step='0.001'  onChange={(e: any)=> { this.setState({terrainRed: e.target.value })}}/> 
                  <span>{ this.state.terrainRed }</span>
                  </td>
                <td>
                  <input type='range' min='0' max='2' step='0.001'  onChange={(e: any)=> { this.setState({terrainGreen: e.target.value })}}/> 
                  <span>{ this.state.terrainGreen }</span>
                </td>
                <td>
                  <input type='range' min='0' max='2' step='0.001' onChange={(e: any)=> { this.setState({terrainBlue: e.target.value })}} /> 
                  <span>{ this.state.terrainBlue }</span>
                </td>
              </tr>
              <tr>
                <td>Terrain Type</td>
                <td>
                  <select onChange={ (e: any)=> { this.onTerrainTypeChange(e) }}>
                    <option value="both">Voxels + Plane</option>
                    <option value="voxels">Terrain Voxels</option>
                    <option value="plane">Ground Plane</option>
                    <option value="empty">Empty Space</option>
                  </select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Flat Areas?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggleFlatAreas(e) }}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Turbulent Terrain?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggleTurbulentTerrain(e) }}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Terrain Flatness</td>
                <td>
                  <input type='range' min='1' max='16' step='0.1'  onChange={(e: any)=> { this.setState({flatness: e.target.value })}}/>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Use Gravity?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggleGravity(e) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>(High Altitude) Zero Gravity?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggleHighAltitudeGravity(e) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>Generate Common Entities</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>Generate Trees?</td>
                  <td>
                    <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'trees', e ) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </td>
                </tr>
              <tr>
                <td></td>
                <td>Generate Rocks?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'rocks', e) }}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Generate Roads?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'roads', e) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                </td>
              </tr>
               <tr>
                <td></td>
                <td>Generate Buildings?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'structures', e ) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                  </select>
                </td>
              </tr>
              <tr>
              <td></td>
              <td>Generate Pylons?</td>
              <td>
                <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'pylons', e ) }}>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
              </td>
            </tr>
               <tr>
                <td></td>
                <td>Generate Vehicles?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'vehicles', e ) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                  </select>
                </td>
              </tr>
               <tr>
                <td></td>
                <td>Generate Tools?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'tools', e ) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Generate Mental Imagery</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td>Generate Orbs?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'orbs', e ) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Generate Columns?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'columns', e ) }}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Generate Wheels?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'wheels', e) }}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Generate Pyramids?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'pyramids', e ) }}>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td></td>
                <td>Generate Indra's Net?</td>
                <td>
                  <select onChange={ (e: any)=> { this.onToggle( 'spawn', 'nets', e) }}>
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={styles.go}>
                    <input type="button"
                            value="Create"
                            style={styles.signInButton as any}
                            onClick={(e: any)=> { this.createSpace() } }
                    />
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>
              </tbody>
            </table>
          </div>
        </Shell>
    )
  }
}

import { connect } from 'react-redux'
import { createSpace } from '../../redux/actions/world-actions'
import { uploadFile } from '../../redux/actions/file-actions'
export default connect(
  (state: any) => {
    return {
      tools: state.tools,
      users: state.users,
      loggedInUser: state.users.loggedIn,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode,
      uploading: state.files.upload.fetching
    }
  },
  (dispatch: any) => {
    return {
      createSpace: (data: any) => {
        dispatch(createSpace(data))
      },
      uploadFile: (file: string, username: string, dir: string) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)(NewSpace)

const styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
        maxWidth: '960px',
        bottom: undefined,
        top: '1em',
        height: '120vh',
        left: ! isMobile() ? '72px' : '0px'
      })
  },
  title: {
    fontSize: "2em",
    paddingTop: "1.5vh",
    paddingBottom: "1vh"
  },
  form: {
    overflowY: 'auto',
    height: '90%',
    overflowX: 'hidden'
  },
  label: {
    marginRight: "1em",
    width: '33.3%',
    display: 'inline-block',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: "left"
  },
  setting: {
    width: '66.6%'
  },
  input: {
    background: 'transparent',
    color: 'white',
    padding: '0.5em',
    border: '2px solid rgba(255,255,255,0.25)'
  },
  textInput: {
    width: '100%'
  },
  username: {
    marginBottom: "1em"
  },
  option: {
    marginBottom: "0.75em",
    width: '100%',
    display: 'inline-block'
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
    float: 'left',
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
  fileUpload: {
    marginRight: '1em'
  }
}