import * as React from "react"; import { Component } from "react";

import { isMobile } from '../../../config'
import {
  FileButton,
  VectorInput,
  textAreaStyle,
  lightboxStyle,
  modalStyle
} from 'energetic-ui'

class ImportToSpace extends Component<any, any> {

  componentWillMount() {

    this.setState({
      activated: false,
      editMode: false,
      text: "",
      name: "",
      data: {},
      coords: "0x0x0",
      world: "Overworld",
      id: 0
    })

  }

  componentWillReceiveProps(nextProps: any) {
    let data = {}

    if (this.props.activated == false && nextProps.activated == true) {
      this.setState({
        activated: true
      })
    }

    if (this.props.itemData == false && nextProps.itemData == true)
      this.setState({ name: nextProps.itemData.name })

  }

  componentWillUpdate(nextProps: any, nextState: any) {

  }

  handleTextChange(e: any) {
    this.setState({
      name: e.target.value
    })
  }

  onCoordChange(value: any, event: any) {
    this.setState({
      coords: value.join("x")
    })
  }

  handleSpaceChange(event: any) {
    this.setState({
      world: event.target.value
    })
  }

  save() {
    let name = this.state.name,
      itemData = Object.assign({}, this.props.itemData),
      data = {}

    itemData.world = this.props.currentSpace

    this.props.addItemToSpace(this.props.username, "Entities", this.props.itemData.id, this.state.world, this.state.coords.join("x"), itemData)
    this.toggleModal()

  }

  toggleModal() {
    this.setState({
      activated: !this.state.activated
    })
  }

  render() {
    if (this.state.activated) {
      return (
        <div style={styles.lightbox as any}>
          <div style={styles.modal()} >
            <div style={styles.header}>
              <span style={styles.title}>
                <span style={{ marginRight: '0.5em' }}>Import To Space</span>
                <input type="text" disabled onChange={(e) => { this.handleTextChange(e) }} style={styles.text} />
              </span>
              <div style={styles.basicInput}>
                Select world to import into
                <select onChange={e => this.handleSpaceChange(e)}>
                  {
                    this.props.spaces.map((world: any, w: number) => {
                      return (
                        <option key={w} value={world.name}>{world.name}</option>
                      )
                    })
                  }
                </select>
              </div>
              <div style={styles.basicInput}>
                Specify coordinates: <VectorInput axis={3} decimalPlaces={0} onChange={(value: any, event: any) => { this.onCoordChange(value, event) }} />
              </div>

            </div>
            <div style={styles.body}>
              <FileButton title="Add" onClick={() => { this.save() }} />
              <FileButton title="Cancel" onClick={() => { this.toggleModal() }} style={styles.cancelButton} />
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}

import { connect } from 'react-redux'
import {
  addItemToSpace
} from '../../redux/actions/inventory-actions'
import {
  closeImportToSpace
} from '../../redux/actions/util-actions'

export default connect(
  (state: any, ownProps: any) => {
    return {
      cwd: state.files.listDirectories.workingPath,
      section: state.app.navigateToUrl.pathname,
      stereoMode: state.app.stereoMode,
      menuOpen: state.app.menuOpen,
      vrMode: state.app.vrMode,
      currentSpace: state.spaces.current,
      spaces: state.spaces.all,
      username: state.users.loggedIn ? state.users.loggedIn.name : "public",
      activated: state.util.importToSpace.activated,
      itemId: state.util.importToSpace.itemId,
      itemData: state.util.importToSpace.itemData,
      dir: state.util.importToSpace.dir,
      instances: state.util.importToSpace.windowsOpen
    }
  },
  (dispatch: any) => {
    return {
      addItemToSpace: (userId: any, category: string, itemId: any, world: string, coords: string, itemData: any) => {
        dispatch(addItemToSpace(userId, category, itemId, world, coords, itemData))
      },
      closeImportToSpace: () => {
        dispatch(closeImportToSpace())
      }
    }
  }
)(ImportToSpace)

let styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
      maxWidth: '1080px',
      left: !isMobile() ? '72px' : '0px'
    })
  },
  lightbox: lightboxStyle,
  basicInput: {
    marginBottom: '0.5em'
  },
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
    border: 'none',
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