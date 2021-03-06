import * as React from "react"; import { Component } from "react";
import { withRouter } from 'react-router-dom'
import { FileButton } from 'energetic-ui'
import {
  rgba,
  rgb
} from '../../../util'
import { 
  textAreaStyle,
  lightboxStyle, 
  modalStyle 
} from '../../styles'

import { isMobile } from '../../../config'

class SharingSettings extends Component<any, any> {

  componentWillMount () {

    this.setState({
      activated: false,
      editMode: false,
      text: "",
      name: "",
      data: {},
      id: 0
    })

    this.props.listShares( this.props.username )
    
  }

  componentWillReceiveProps ( nextProps: any) {
    if ( this.props.sharesFetching && nextProps.sharesFetching == false && !!nextProps.readText ) {
      this.setState({
        text: nextProps.readText
      })
    }

    if ( this.props.activated == false && nextProps.activated == true ) {
      this.setState({
        activated: true
      })
    }

  }

  componentWillUpdate ( nextProps: any, nextState: any ) {

  }

  handleTextChange(e: any) {
    this.setState({
      name: e.target.value
    })
  }

  remove ( index: number ) {
    let data = {
      id: this.props.shares[ index ].id
    }

    this.props.deleteShare( this.props.username, data )
  }

  shareFolder () {
    let data = {
      username: this.props.username,
      directory: this.props.cwd.join("/")
    }

    this.props.createShare( this.props.username, data )
  }

  save ( id: number ) {
    let name = this.state.name,
        data = {}

    if ( id ) {
        this.props.shares.map( (s: any) => { 
          if ( s.id == id ) 
            data = s
        })
        data = Object.assign({}, data, this.state.data )
        this.props.updateShare(  this.props.username, data )
    } else {
        this.props.createShare(  this.props.username, this.state.data )
    }

  }

  toggleModal (open?: boolean) {
    this.setState({
      activated: open === undefined ? !this.state.activated : open
    })
  }

  render() {
      return (
        <Modal title="Sharing Settings"  hiddenWhenClosed={true} open={this.state.activated} onToggle={ (open: boolean) => { this.toggleModal(open)}}>
            <div style={ styles.header }>
              <span style={ styles.title }> <span style={{marginRight: '0.5em'}}>Shared Folders</span> </span>
              <table>
                <tbody>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>directory</th>
                  <th></th>
                </tr>
                {
                    this.props.shares.map( (s: any , i: number) => {
                        return (
                            
                            <tr key={i}>
                                <td>{s.id}</td>
                                <td>{s.name}</td>
                                <td>{s.directory}</td>
                                <td> <FileButton title="Remove" onClick={ () => { this.remove(i) } } /></td>
                            </tr>
                        )
                    })
                }
                </tbody>
              </table>
            </div>
            <div style={ styles.body }>
              <FileButton title="Share Current Folder" onClick={ () => { this.shareFolder() } } />
              <FileButton title="Close" onClick={ () => { this.toggleModal() } } style={ styles.cancelButton } />
            </div>
        </Modal>
      )
  }
}

import { connect } from 'react-redux'
import {
    toggleMenu
} from '../../redux/actions/app-actions'
import {
  listShares,
  updateShare,
  createShare,
  deleteShare,
  writeText
} from '../../redux/actions/file-actions'
import {
  closeSharingSettings
} from '../../redux/actions/util-actions'
import { Modal } from "energetic-ui";

export default connect(
  (state: any, ownProps: any) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        section: state.app.navigateToUrl.pathname,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode,
        shares: state.files.listShares.data ? state.files.listShares.data : [],
        sharesFetching: state.files.listShares.fetching || state.files.createShare.fetching,
        username: state.users.loggedIn ? state.users.loggedIn.name : "public",
        activated: state.util.sharingSettings.activated,
        filename: state.util.sharingSettings.filename,
        fileUser: state.util.sharingSettings.username,
        instances: state.util.sharingSettings.windowsOpen,
        dir: state.util.sharingSettings.dir,
    }
  },
  (dispatch: any) => {
    return {
      listShares: (username: string) => {
        dispatch( listShares(username) )
      },
      updateShare: (username: string, data: any) => {
        dispatch ( updateShare(username, data) )
      },
      createShare: (username: string, data: any) => {
        dispatch ( createShare(username, data) )
      },
      deleteShare: (username: string, data: any) => {
          dispatch(deleteShare(username, data))
      },
      closeSharingSettings: () => {
        dispatch( closeSharingSettings() )
      }
    }
  }
)(SharingSettings)

let styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
        maxWidth: '729px',
        left: ! isMobile() ? '72px' : '0px'
      })
  },
  lightbox: lightboxStyle,
  resultingPath: {
    marginBottom: '1em'
  },
  cancelButton: {
    borderLeft: 'solid 0.2em #005aff'
  },
  header: {
    width: '100%',
    marginTop: '0.5em',
    marginBotto: '0.5em'
  },
  text: {
    width: '75%',
    padding: '0.25em',
    marginBottom: '0.5em',
    background: '#212121',
    border: 'solid 0.1em'+ rgba(255, 255, 255, 0.19),
    borderRadius: '2px',
    fontSize: '1em',
    color: 'white',
  },
  textArea: textAreaStyle,
  body: {

  },
  title: {

  }
}