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

class Worlds extends Component {

  switchWorlds ( userName, name ) {

    if (userName == '') {

      userName = 'space'

    }
    //browserHistory.push(userName+"/"+name)
    //window.location.href = window.location.href // workaround..
    this.props.setCurrentWorld( userName, name )
    three.world.reload( userName, name, false, false )
  }

  _renderWorlds ( worlds ) {

    return worlds.map((world, i) => {

        let thumb = ''

        if (world.sky.photosphere != '') {

          thumb = world.sky.photosphere.split("/")
          thumb.splice(thumb.length-1, 0, "thumbs")
          thumb = thumb.join("/")+'.jpg'

        }

        return (
          <Card clickHandler={(e, v) => {
                  this.switchWorlds(world.userName, world.name)
                }}
                color={`#${(world.light.color).toString(16)}`}
                image={world.sky.photosphere != '' ? `/data/user/${thumb}` : ""}
                showTitle={true}
                compact={world.sky.photosphere == ''}
                title={world.name}
                key={i}
          />
        )

    })

  }

  render() {

    let worlds = [], // this.props.worlds
        worldsWithSkyboxes = [],
        userWorlds = [], // this.props.userWorlds
        userWorldsWithSkyboxes = []

        !!this.props.worlds && this.props.worlds.map( (world) => {

          if ( !!world.sky.photosphere ) {

            worldsWithSkyboxes.push( world )

          } else {

            worlds.push( world )            

          }

        })

        !!this.props.userWorlds && this.props.userWorlds.map( (world) => {
          
          if ( !!world.sky.photosphere ) {

            userWorldsWithSkyboxes.push( world )

          } else {

            userWorlds.push( world )            

          }

        })

    return (
        <Shell className="worlds">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Worlds"
                     username={this.props.username}
                     onItemSelect={  (item, index, length) => {
                        console.log("changing dir from location bar")
                        let path = this.props.workingPath
                        path.splice(index+1)
                        this.props.changeDirectory(path)
                     }}
        />
          <div style={styles.worlds}>
            { this._renderWorlds( userWorldsWithSkyboxes ) }
          </div>
          <div style={styles.worlds}>
            { this._renderWorlds( userWorlds ) }
          </div>
          <div style={styles.worlds}>
            { this._renderWorlds( worldsWithSkyboxes ) }
          </div>
          <div style={styles.worlds}>
            { this._renderWorlds( worlds ) }
          </div>

        </Shell>
    )
  }
}

Worlds.defaultProps = {

}
import { connect } from 'react-redux';
import {
    sendMessage
} from '../../redux/actions/message-actions'
import { fetchWorlds, setCurrentWorld } from '../../redux/actions/world-actions'

export default connect(
  (state, ownProps) => {
    return {
        worlds: state.worlds.all,
        userWorlds: state.worlds.userWorlds
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
