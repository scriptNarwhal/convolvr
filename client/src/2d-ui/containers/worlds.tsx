import * as React from "react"; import { Component } from "react";
import { browserHistory } from 'react-router'
import Card from '../components/card'
import Shell from '../components/shell'
import LocationBar from '../components/location-bar'
import { isMobile } from '../../config'

class Spaces extends Component<any, any> {

  handleBGClick (e) {
    if (e.target.getAttribute("id") == "bg-toggle-menu") {
      this.props.toggleMenu(false)
      browserHistory.push("/")

    }
  }

  switchSpaces ( userName, name ) {

    if (userName == '') {
      userName = 'space'
    }
    //browserHistory.push(userName+"/"+name)
    //window.location.href = window.location.href // workaround..
    this.props.setCurrentSpace( userName, name )
    three.world.reload( userName, name, false, false )
    this.props.toggleMenu(false)
  }

  _renderSpaces ( spaces ) {

    return spaces.map((world, i) => {

        let thumb = ''

        if (world.sky.photosphere != '') {

          thumb = world.sky.photosphere.split("/")
          thumb.splice(thumb.length-1, 0, "thumbs")
          thumb = thumb.join("/")+'.jpg'

        }

        return (
          <Card clickHandler={(e, v) => {
                  this.switchSpaces(world.userName, world.name)
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

    let spaces = [], // this.props.spaces
        spacesWithSkyboxes = [],
        userSpaces = [], // this.props.userSpaces
        userSpacesWithSkyboxes = []

        !!this.props.spaces && this.props.spaces.map( (world) => {

          if ( !!world.sky.photosphere ) {
            spacesWithSkyboxes.push( world )
          } else {
            spaces.push( world )            
          }

        })

        !!this.props.userSpaces && this.props.userSpaces.map( (world) => {
          
          if ( !!world.sky.photosphere ) {
            userSpacesWithSkyboxes.push( world )
          } else {
            userSpaces.push( world )            
          }

        })

    return (
        <Shell className="spaces">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Spaces"
                     username={this.props.username}
                     onItemSelect={  (item, index, length) => {
                        console.log("changing dir from location bar")
                        let path = this.props.workingPath
                        path.splice(index+1)
                        this.props.changeDirectory(path)
                     }}
        />
        <span style={styles.container(isMobile())}
              onClick={ (e) => { this.handleBGClick(e) } }
              id="bg-toggle-menu" 
        >
          <div style={styles.spaces}>
            { this._renderSpaces( userSpacesWithSkyboxes ) }
          </div>
          <div style={styles.spaces}>
            { this._renderSpaces( userSpaces ) }
          </div>
          <div style={styles.spaces}>
            { this._renderSpaces( spacesWithSkyboxes ) }
          </div>
          <div style={styles.spaces}>
            { this._renderSpaces( spaces ) }
          </div>
        </span>
      </Shell>
    )
  }
}

Spaces.defaultProps = {

}
import { connect } from 'react-redux';
import {
  toggleMenu
} from '../../redux/actions/app-actions'
import { fetchSpaces, setCurrentSpace } from '../../redux/actions/world-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
        spaces: state.spaces.all,
        userSpaces: state.spaces.userSpaces
    }
  },
  (dispatch: any) => {
    return {
      toggleMenu: (force) => {
        dispatch( toggleMenu( force ) )
      },
      setCurrentSpace: (userName, world) => {
          dispatch(setCurrentSpace(userName, world))
      }
    }
  }
)(Spaces)

let styles = {
  spaces: {
    width: "100%",
    minWidth: "320px",
    margin: "auto"
  },
  container: (mobile) => {
    return {
      width: '100%',
      height: '100%',
      position:'fixed',
      // top: 0,
      left: 0, 
      top: mobile ? '150px' : '72px'
    }
  }
}