import * as React from "react"; import { Component } from "react";
import { withRouter } from 'react-router-dom'
import Card from '../components/card'
import Shell from '../components/shell'
import LocationBar from '../components/location-bar'

class Network extends Component<any, any> {

  handleBGClick (e: any) {
    if (e.target.getAttribute("id") == "bg-toggle-menu") {
      this.props.toggleMenu(false)
      this.props.history.push("/")

    }
  }

  componentWillMount () {
    console.log("init network view !!!")
    if (!!!this.props.settings) {
      this.props.fetchUniverseSettings()
    }
  }

  switchDomain (name: string) {
    window.location.href = name // workaround
  }

  render() {
    return (
        <Shell htmlClassName="spaces">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Network"
                     username={this.props.username}
                     onItemSelect={  (item: any, index: number, length: number) => {
                        
                     }}
        />
         <span style={{ width: '100%', height: '100%', position:'fixed', top: 0, left: 0}}
              onClick={ (e) => { this.handleBGClick(e) } }
              id="bg-toggle-menu" 
        >
          <div style={styles.spaces}>
          {
            this.props.settings != undefined && this.props.settings.network != undefined &&
              this.props.settings.network.map((domain: any, i: number) => {
              return (
                <Card clickHandler={(e: any, v: any) => {
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

import { connect } from 'react-redux';

import {
  fetchUniverseSettings
} from '../redux/actions/world-actions'
import {
  toggleMenu, navigateTo
} from '../redux/actions/app-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
        fetchingSettings: state.spaces.fetchingSettings,
        settings: state.spaces.universeSettings,
    }
  },
  (dispatch: any) => {
    return {
      historyPush: (url: string, native = false) => {
        dispatch(navigateTo(url, native))
      },
      toggleMenu: (force: boolean) => {
        dispatch( toggleMenu( force ) )
      },
      fetchUniverseSettings: () => {
        dispatch(fetchUniverseSettings())
      }
    }
  }
)(Network)

const styles = {
  spaces: {
    width: "100%",
    minWidth: "320px",
    margin: "auto"
  }
}