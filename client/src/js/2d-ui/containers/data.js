import React, { Component } from 'react'
import Shell from '../shell'
import Card from '../card'
import LocationBar from '../location-bar'

let styles = {
  hr: {
    visibility: 'hidden'
  }
}

class Data extends Component {
  componentWillMount () {
    this.props.listFiles(this.props.username, this.props.workingPath.join("/"))
    this.props.listDirectories(this.props.username, this.props.workingPath.join("/"))
    this.setState({
      update: 0
    })
  }
  componentWillUpdate (nextProps, nextState) {
    console.log("next props workingPath")
    console.log(nextProps.workingPath.length)
    if (nextProps.workingPath.length != this.props.workingPath.length) {
      console.log("changing directory...", nextProps.workingPath)
      this.props.listFiles(this.props.username, nextProps.workingPath.join("/"))
      this.props.listDirectories(this.props.username, nextProps.workingPath.join("/"))
    }
    if ((this.props.filesFetching == false && nextProps.filesFetching != false) ||
         this.props.dirsFetching == false && nextProps.dirsFetching != false) {
      console.log("finished loading files or dirs")
      this.setState({
        update: this.state.update+1
      })
    }
  }
  isImage (file) {
    return /(.png|.jpg|.jpeg|.gif|webp)/.test(file)
  }
  getFullPath (file, thumbnail) {
    let username = this.props.username,
        workingPath = this.props.workingPath.join("/")
    if (thumbnail && this.isImage(file)) {
      return `/data/${username}${workingPath}/thumbs/${file}.jpg`
    } else {
      return `/data/${username}${workingPath}/${file}`
    }
  }
  enterDirectory (dir) {
    let path = this.props.workingPath
    path.push(dir)
    this.props.changeDirectory(path)
    this.update(250)
  }
  update (time) {
    setTimeout(()=>{
      this.setState({
        update: this.state.update+1
      })
    }, time)
  }
  render() {
    let files = this.props.files !== false && this.props.filesFetching == false ? this.props.files : [],
        dirs = this.props.dirs !== false && this.props.dirsFetching == false ? this.props.dirs : []
    return (
        <Shell className="data-view">
          <LocationBar path={this.props.workingPath}
                       label="Data"
                       username={this.props.username}
                       onItemSelect={  (item, index, length) => {
                          console.log("changing dir from location bar")
                          let path = this.props.workingPath
                          path.splice(index+1)
                          this.props.changeDirectory(path)
                          this.update(250)
                       }}
          />
          {
            !this.props.filesFetching && !this.props.dirsFetching &&
            dirs.map((dir, i) => {
              return (
                <Card image={''}
                      clickHandler={ (e, title) => {
                        console.log(e, title, "clicked")
                        this.enterDirectory(title)
                        this.update(250)
                      }}
                      compact={true}
                      showTitle={true}
                      title={dir}
                      key={i}
                />
              )
            })
          }
          <hr style={styles.hr} />
          {
            !this.props.filesFetching && !this.props.dirsFetching &&
            files.map((file, i) => {
              return (
                <Card image={this.isImage(file) ? this.getFullPath(file, true) : ''}
                      clickHandler={ (e, title) => {
                        console.log(e, title, "clicked")
                        let newWindow = window.open(this.getFullPath(file), "_blank")
                        newWindow.focus()
                      }}
                      compact={!this.isImage(file)}
                      showTitle={true}
                      title={file}
                      key={i}
                />
              )
            })
          }
        </Shell>
    )
  }
}

Data.defaultProps = {

}
import { connect } from 'react-redux';
import {
    sendMessage
} from '../../redux/actions/message-actions'
import {
  toggleMenu,
  showChat
} from '../../redux/actions/app-actions'
import {
  listFiles,
  listDirectories,
  changeDirectory,
  uploadFiles
} from '../../redux/actions/file-actions'
export default connect(
  (state, ownProps) => {
    return {
        loggedIn: state.users.loggedIn,
        username: state.users.loggedIn != false ? state.users.loggedIn.name : "public",
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        chatOpen: state.app.chatOpen,
        vrMode: state.app.vrMode,
        files: state.files.list.data,
        dirs: state.files.listDirectories.data,
        filesFetching: state.files.list.fetching,
        dirsFetching: state.files.listDirectories.fetching,
        workingPath: state.files.listDirectories.workingPath,
        upload: state.files.uploadMultiple
    }
  },
  dispatch => {
    return {
      listFiles: (username, dir) => {
          dispatch(listFiles(username, dir))
      },
      listDirectories: (username, dir) => {
          dispatch(listDirectories(username, dir))
      },
      changeDirectory: (path) => {
        dispatch(changeDirectory(path))
      },
      toggleMenu: (toggle) => {
        dispatch(toggleMenu(toggle))
      },
      uploadFile: (file, username, dir) => {
        dispatch(uploadFile(file, username, dir))
      }
    }
  }
)(Data)
