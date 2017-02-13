import React, { Component } from 'react'
import Shell from '../components/shell'

const styles = {

}

export default class Settings extends Component {
  changeSetting (setting, value) {
    localStorage.setItem(setting, value)
  }
  render() {
    return (
        <Shell className="settings">
          <h2>Settings</h2>
          <div>
            <h3>Camera Control Mode</h3>
            <select onChange={e=> {this.changeSetting("camera", e.value)}}>
              <option value="fps">First Person Camera</option>
              <option value="vehicle">Flight Camera (relative rotation)</option>
            </select>
          </div>
          <div>
            <h3>Lighting Quality</h3>
            <select onChange={e=> {this.changeSetting("lighting", e.value)}}>
              <option value="high">High (recommended for desktops & laptops)</option>
              <option value="low">Low (mobile devices)</option>
            </select>
          </div>
          <div>
            <h3>Antialiasing</h3>
            <select onChange={e=> {this.changeSetting("aa", e.value)}}>
              <option value="on">On (recommended)</option>
              <option value="off">Off (for older GPUs)</option>
            </select>
          </div>
        </Shell>
    )
  }
}

Settings.defaultProps = {

}
