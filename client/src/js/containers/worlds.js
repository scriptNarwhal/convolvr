import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Shell from '../components/shell'
import Card from '../components/card'

const styles = {
  worlds: {

  }
}

class Worlds extends Component {
  switchWorlds (name) {
    browserHistory.push("/world/"+name)
    this.props.setCurrentWorld(name)
    three.world.reload(name)
  }
  render() {
    return (
        <Shell className="worlds">
          {
            this.props.worlds.map((world, i) => {
              return (
                <Card key={i} showTitle={true} clickHandler={(e, v) => {
                  this.switchWorlds(world.name)
                }} image="/data/circle-a.png" title={world.name}  />
              )
            })
          }
        </Shell>
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
      sendMessage: (message) => {
          dispatch(sendMessage(message))
      },
      setCurrentWorld: (world) => {
          dispatch(setCurrentWorld(world))
      }
    }
  }
)(Worlds)
