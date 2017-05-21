import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Card from '../components/card'
import Shell from '../components/shell'
import LocationBar from '../components/location-bar'

const styles = {
  worlds: {
    width: "100%",
    minWidth: "320px",
    margin: "auto"
  }
}

class Network extends Component {
  constructor () {

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

export default connect(
  (state, ownProps) => {
    return {
        fetchingSettings: state.worlds.fetchingSettings,
        settings: state.worlds.universeSettings,
    }
  },
  dispatch => {
    return {
      fetchUniverseSettings: () => {
        dispatch(fetchUniverseSettings())
      }
    }
  }
)(Network)
