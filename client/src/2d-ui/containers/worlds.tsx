import * as React from "react";
import { Component } from "react";
import { withRouter } from 'react-router-dom'
import Card from '../components/card'
import Shell from '../components/shell'
import LocationBar from '../components/location-bar'
import { isMobile } from '../../config'

interface SpacesProps {
  setCurrentSpace: Function
  changeDirectory: Function
  toggleMenu: Function
  history: any,
  workingPath: any,
  spaces: any[],
  userSpaces: any[],
  username: string
}

class Spaces extends Component<SpacesProps, any> {

  public props: SpacesProps

  handleBGClick (e: any) {
    if (e.target.getAttribute("id") == "bg-toggle-menu") {
      this.props.toggleMenu(false)
      this.props.history.push("/")

    }
  }

  switchSpaces ( userName: string, name: string ) {
    if (userName == '') {
      userName = 'space'
    }
    //this.props.history.push(userName+"/"+name)
    //window.location.href = window.location.href // workaround..
    this.props.setCurrentSpace( userName, name );
    (window as any).three.world.reload( userName, name, false, false );
    this.props.toggleMenu(false)
  }

  _renderSpaces ( spaces: any[] ) {

    return spaces.map((world: any, i: number) => {
        let thumb = '',
            thumbPath: string[] = [];

        if (world.sky.photosphere != '') {
          thumbPath = world.sky.photosphere.split("/")
          thumbPath.splice(thumbPath.length-1, 0, "thumbs")
          thumb = thumbPath.join("/")+'.jpg'
        }

        return (
          <Card clickHandler={(e: any, v: any) => {
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
    let spaces: any[] = [], // this.props.spaces
        spacesWithSkyboxes: any[] = [],
        userSpaces: any[] = [], // this.props.userSpaces
        userSpacesWithSkyboxes: any[] = []

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
        <Shell htmlClassName="spaces">
        <LocationBar path={[]} // nested place explorer would be cool (empty array for now)
                     label="Spaces"
                     username={this.props.username}
                     onItemSelect={  (item: any, index: number, length: string) => {
                        console.log("changing dir from location bar")
                        let path = this.props.workingPath
                        path.splice(index+1)
                        this.props.changeDirectory(path)
                     }}
        />
        <span style={styles.container(isMobile()) as any}
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
      toggleMenu: (force: boolean) => {
        dispatch( toggleMenu( force ) )
      },
      setCurrentSpace: (userName: string, world: string) => {
          dispatch(setCurrentSpace(userName, world))
      }
    }
  }
)(withRouter(Spaces as React.ComponentClass<any>) as React.ComponentClass<any> )

let styles = {
  spaces: {
    width: "100%",
    minWidth: "320px",
    margin: "auto"
  },
  container: (mobile: boolean) => {
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