import React, { Component } from 'react'
import Shell from '../shell'

const styles = {
  modal: {
    width: '66.66vh',
    height: '66.66vh',
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
  save: {
    float: 'left',
    marginLeft: '2em',
    marginTop: '1em',
    fontSize: '1.25em'
  },
  h3: {
    textAlign: 'left',
    marginLeft: '2em'
  }
}

export default class Settings extends Component {
  constructor () {
    this.state = {
      camera: 'fps',
      lighting: 'high',
      aa: 'on',
      postProcessing: 'on'
    }
  }
  componentWillMount () {
    let aa = localStorage.getItem("aa")
    if (aa == null) {
      aa = 'on'
    }
    this.setState({
      camera: localStorage.getItem("camera") || 'fps',
      lighting: localStorage.getItem("lighting") || 'high',
      postProcessing: localStorage.getItem("postProcessing") || 'on',
      aa
    })
  }
  reload () {
    window.location.href = window.location.href
  }
  save () {
    localStorage.setItem('camera', this.state.camera)
    localStorage.setItem('lighting', this.state.lighting)
    localStorage.setItem('aa', this.state.aa)
    localStorage.setItem('postProcessing', this.state.postProcessing)
    this.reload()
  }
  render() {
    return (
        <Shell className="settings">
          <div style={styles.modal}>
          <h2>Settings</h2>
          <div>
            <h3 style={styles.h3}>Camera Control Mode</h3>
            <select onChange={e=> { this.setState({camera: e.target.value})}}
                    defaultValue={ this.state.camera }
            >
              <option value="fps">First Person Camera</option>
              <option value="vehicle">Flight Camera (relative rotation)</option>
            </select>
          </div>
          <div>
            <h3 style={styles.h3}>Lighting Quality</h3>
            <select onChange={e=> {this.setState({lighting: e.target.value})}}
                    defaultValue={ this.state.lighting }
            >
              <option value="high">High (recommended)</option>
              <option value="low">Low (mobile devices)</option>
            </select>
          </div>
          <div>
            <h3 style={styles.h3}>Antialiasing</h3>
            <select onChange={e=> {this.setState({aa: e.target.value})}}
                    defaultValue={ this.state.aa }
            >
              <option value="on">On (recommended)</option>
              <option value="off">Off (for older GPUs)</option>
            </select>
          </div>
          <div>
            <h3 style={styles.h3}>Post Processing</h3>
            <select onChange={e=> {this.setState({postProcessing: e.target.value})}}
                    defaultValue={ this.state.aa }
            >
              <option value="on">On (Bloom HDR Effect)</option>
              <option value="off">Off (Better Performance)</option>
            </select>
          </div>
          <input style={styles.save}
                 type='submit'
                 value="Save Changes"
                 onClick={ e=> this.save()}
          />
          </div>
        </Shell>
    )
  }
}

Settings.defaultProps = {

}
