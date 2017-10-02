import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Card from '../components/card'
import Shell from '../components/shell'
import LocationBar from '../components/location-bar'

class Places extends Component {

  setCurrentPlace (userName, world, name) {
    if (userName == '') {
      userName = 'space'
    }
    browserHistory.push(userName+"/"+world+"/"+name)
    window.location.href = window.location.href // workaround..
    // this.props.setCurrentWorld(name)
    // three.world.reload(name)
  }

  render() {
    return (
        <Shell className="worlds">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Places"
                     username={this.props.username}
                     onItemSelect={  (item, index, length) => {
                        console.log("changing dir from location bar")
                        let path = this.props.workingPath
                        path.splice(index+1)
                        this.props.changeDirectory(path)
                     }}
        />
          <div style={styles.worlds}>
          {
            this.props.userPlaces.map((place, i) => {
              let thumb = ''
             
              return (
                <Card clickHandler={(e, v) => {
                        this.setCurrentPlace(place.userName, place.world, place.name)
                      }}
                      color={`#${(world.light.color).toString(16)}`}
                      showTitle={true}
                      title={place.name}
                      key={i}
                />
              )
            })
          }
          </div>
          <div style={styles.worlds}>
          {
            this.props.places.map((world, i) => {
              let thumb = ''
              
              return (
                <Card clickHandler={(e, v) => {
                        this.setCurrentPlace(place.userName, place.world, place.name)
                      }}
                      color={`#${(place.color).toString(16)}`}
                      showTitle={true}
                      title={place.name}
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

Places.defaultProps = {

}
import { connect } from 'react-redux';

import { fetchPlaces, setCurrentPlace } from '../../redux/actions/place-actions'

export default connect(
  (state, ownProps) => {
    return {
        places: state.places.all,
        userPlaces: state.places.userPlaces
    }
  },
  dispatch => {
    return {
      setCurrentPlace: (user, world, place) => {
          dispatch(setCurrentWorld(user, world, place))
      }
    }
  }
)(Places)
