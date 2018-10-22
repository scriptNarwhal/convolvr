import * as React from "react"; import { Component } from "react";
import { Card, LocationBar } from 'energetic-ui'
import Shell from '../components/shell'

class Places extends Component<any, any> {

  handleBGClick (e: any) {
    if (e.target.getAttribute("id") == "bg-toggle-menu") {
      this.props.toggleMenu(false)
      this.props.historyPush("/")

    }
  }

  setCurrentPlace (userName: string, world: string, name: string) {
    if (userName == '') {
      userName = 'space'
    }
    this.props.historyPush(userName+"/"+world+"/"+name)
    window.location.href = window.location.href // workaround..
    // this.props.setCurrentSpace(name)
    // three.world.reload(name)
  }

  render() {
    return (
        <Shell htmlClassName="spaces">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Places"
                     username={this.props.username}
                     onItemSelect={  (item: any, index: number, length: number) => {
                        console.log("changing dir from location bar")
                        let path = this.props.workingPath
                        path.splice(index+1)
                        this.props.changeDirectory(path)
                     }}
        />
          <span style={{ width: '100%', height: '100%', position:'fixed', top: 0, left: 0}}
              onClick={ (e) => { this.handleBGClick(e) } }
              id="bg-toggle-menu" 
        >
        <div style={styles.spaces}>
          {
            this.props.userPlaces.map((place: any, i: number) => {
              let thumb = ''
             
              return (
                <Card clickHandler={(e: any, v: any) => {
                        this.setCurrentPlace(place.userName, place.world, place.name)
                      }}
                      // color={`#${(place.light.color).toString(16)}`}
                      showTitle={true}
                      title={place.name}
                      key={i}
                />
              )
            })
          }
          </div>
          <div style={styles.spaces}>
          {
            this.props.places.map((place: any, i: number) => {
              let thumb = ''
              
              return (
                <Card clickHandler={(e: any, v: any) => {
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
        </span>
        </Shell>
    )
  }
  
}


import { connect } from 'react-redux';
import {
  toggleMenu, navigateTo
} from '../redux/actions/app-actions'
import { fetchPlaces, setCurrentPlace } from '../redux/actions/place-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
        places: state.places.all,
        userPlaces: state.places.userPlaces
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
      setCurrentPlace: (user: string, world: string, place: string) => {
          dispatch(setCurrentPlace(user, world, place))
      }
    }
  }
)(Places)

const styles = {
  spaces: {
    width: "100%",
    minWidth: "320px",
    margin: "auto"
  }
}