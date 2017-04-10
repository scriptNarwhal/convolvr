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
  switchDomain (name) {
    window.location.href = name// workaround
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
            this.props.network.map((world, i) => {
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

import { fetchDomains } from '../../redux/actions/network-actions'

export default connect(
  (state, ownProps) => {
    return {
        worlds: state.worlds.all
    }
  },
  dispatch => {
    return {
      fetchDomains: (params) => {
          dispatch(fetchDomains(params))
      }
    }
  }
)(Network)
