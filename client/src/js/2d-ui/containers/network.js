import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Card from '../components/card'
import Shell from '../components/shell'
import LocationBar from '../components/location-bar'

class Network extends Component {

  constructor () {

    super()

  }

  handleBGClick (e) {
    if (e.target.getAttribute("id") == "bg-toggle-menu") {
      this.props.toggleMenu(false)
      browserHistory.push("/")

    }
  }

  componentWillMount () {
    console.log("init network view !!!")
    if (!!!this.props.settings) {
      this.props.fetchUniverseSettings()
    }
  }

  switchDomain (name) {
    window.location.href = name // workaround
  }

  render() {
    return (
        <Shell className="worlds">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Network"
                     username={this.props.username}
                     onItemSelect={  (item, index, length) => {
                        
                     }}
        />
         <span style={{ width: '100%', height: '100%', position:'fixed', top: 0, left: 0}}
              onClick={ (e) => { this.handleBGClick(e) } }
              id="bg-toggle-menu" 
        >
          <div style={styles.worlds}>
          {
            this.props.settings != undefined && this.props.settings.network != undefined &&
              this.props.settings.network.map((domain, i) => {
              return (
                <Card clickHandler={(e, v) => {
                        this.switchDomain(domain.name)
                      }}
                      compact={true}
                      showTitle={true}
                      title={domain.name}
                      key={i}
                />
              )
            })
          }
          </div>
          </span>
        </Shell>
    )
  }
}

Network.defaultProps = {

}
import { connect } from 'react-redux';

import {
  fetchUniverseSettings
} from '../../redux/actions/world-actions'
import {
  toggleMenu
} from '../../redux/actions/app-actions'

export default connect(
  (state, ownProps) => {
    return {
        fetchingSettings: state.worlds.fetchingSettings,
        settings: state.worlds.universeSettings,
    }
  },
  dispatch => {
    return {
      toggleMenu: (force) => {
        dispatch( toggleMenu( force ) )
      },
      fetchUniverseSettings: () => {
        dispatch(fetchUniverseSettings())
      }
    }
  }
)(Network)

const styles = {
  worlds: {
    width: "100%",
    minWidth: "320px",
    margin: "auto"
  }
}