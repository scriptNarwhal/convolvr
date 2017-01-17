import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Card from '../components/card'

const styles = {
  worlds: {
    width: "45%",
    minWidth: "320px",
    margin: "auto"
  }
}

class Worlds extends Component {
  switchWorlds (name) {
    browserHistory.push("/world/"+name)
    window.location.href = window.location.href // workaround..
    // this.props.setCurrentWorld(name)
    // three.world.reload(name)
  }
  render() {
    return (
        <div className="worlds">
          <div style={styles.worlds}>
          {
            this.props.worlds.map((world, i) => {
              return (
                <Card key={i} showTitle={true} clickHandler={(e, v) => {
                  this.switchWorlds(world.name)
                }} image="/data/circle-a.png" title={world.name}  />
              )
            })
          }
          </div>
        </div>
    )
  }
}

Worlds.defaultProps = {

}
import { connect } from 'react-redux';
import {
    sendMessage
} from '../redux/actions/message-actions'
import { fetchWorlds, setCurrentWorld } from '../redux/actions/world-actions'

export default connect(
  (state, ownProps) => {
    return {
        worlds: state.worlds.all
    }
  },
  dispatch => {
    return {
      sendMessage: (message, from) => {
          dispatch(sendMessage(message, from))
      },
      setCurrentWorld: (world) => {
          dispatch(setCurrentWorld(world))
      }
    }
  }
)(Worlds)
