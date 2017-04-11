import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Card from '../card'
import Shell from '../shell'
import LocationBar from '../location-bar'

const styles = {
  worlds: {
    width: "100%",
    minWidth: "320px",
    margin: "auto"
  }
}

class Network extends Component {
  componentWillMount () {
    if (this.props.settings == null) {
      this.props.fetchUniverseSettings()
    }
  }
  switchDomain (name) {
    window.location.href = name// workaround
  }
  render() {
    return (
        <Shell className="settings">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Network"
                     username={this.props.username}
                     onItemSelect={  (item, index, length) => {
                        
                     }}
        />
          <div style={styles.worlds}>
          {
            this.props.settings != null && this.props.settings.network.map((world, i) => {
              return (
                <Card clickHandler={(e, v) => {
                        this.switchDomain(domain.name)
                      }}
                      compact={true}
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
