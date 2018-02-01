/* chat container */
import React, { Component } from 'react'
import Shell from '../components/shell'
import Card from '../components/card'
import Button from '../components/button'
import { browserHistory } from 'react-router'
import LocationBar from '../components/location-bar'
import { rgba, rgb } from '../../util'

let linkRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm,
    imageRegex = /(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)/

class Chat extends Component {

  constructor() {
    super()
    this.state = {
        text: ""
    }
    this.messageBody = null
  }

  handleBGClick (e) {
    if (e.target.getAttribute("id") == "bg-toggle-menu") {
      this.props.toggleMenu(false)
      browserHistory.push("/")

    }
  }

  componentDidMount () {

    let worldMode = three.world.mode

    if (worldMode != 'vr' && worldMode != 'stereo') {
      this.textInput.focus()
    }

    if (this.props.menuOpen == false) {
      this.props.toggleMenu(true)
    }

    if (this.props.chatOpen == false) {
      this.props.showChat()
    }

    setTimeout(()=> { this.scrollToBottom() },500)

  }

  scrollToBottom() {

    if ( this.messageBody ) {

      const scrollHeight = this.messageBody.scrollHeight,
      height = this.messageBody.clientHeight,
      maxScrollTop = scrollHeight - height

      this.messageBody.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0

    }
    

  }

  componentDidUpdate() {

    this.scrollToBottom()

  }

  send (message, files = []) {

      console.log("send button")
      let from = this.props.username,
          avatar = this.props.user.data.profilePicture
      console.warn("send chat message ", avatar)
      this.props.sendMessage(message || this.state.text, from, files, avatar)
      this.setState({
        text: ""
      })
      this.textInput.value = ""

  }

  isImage (file) {

    return imageRegex.test(file)

  }

  renderMessage ( message ) {

    if (linkRegex.test(message)) {

      if (imageRegex.test(message)) {
        return (
            <Card image={message}
                  clickHandler={ (e, title) => {
                   let newWindow = window.open(message, "_blank")
                    newWindow.focus()
                  }}
                  compact={false}
                  showTitle={true}
                  title={ message.substring(0, 30) }
            />
        )
      } else {
        return (
          <a href={message} target="_blank">{message}</a>
        )
      }
    } else {
      return message
    }
  }

  render() {

    let lastSender = '',
        mobile = window.innerWidth <= 720

    return (
        <Shell className="chat"
              noBackground={true}
        >
         <span style={{ width: '100%', height: '100%', position:'fixed', top: 0, left: 0}}
              onClick={ (e) => { this.handleBGClick(e) } }
              id="bg-toggle-menu" 
        >
            <section style={styles.messages(mobile)} ref={ r=> { this.messageBody = r} }>
                {
                    this.props.messages.map((m, i) => {
                        let fromLabel = m.from != lastSender || (m.files != null && m.files.length > 0) ?
                            (<span style={styles.username(m.avatar)} >{m.from}:</span>) : ''
                        lastSender = m.from
                        return (
                        <span key={i} style={styles.message} >
                          <span style={styles.innerMessage}>
                            { fromLabel }
                            <span style={styles.messageText}>{this.renderMessage(m.message)}</span>
                            { m.files != null ? <br style={{marginBottom: '0.5em'}} /> : '' }
                            {
                              m.files != null && m.files.map((file, i) => {
                                  let userDir = m.from != 'Human' ? m.from : 'public'
                                  return (
                                    <Card image={this.isImage(file) ? `/data/user/${userDir}/chat-uploads/thumbs/${file}.jpg` : ''}
                                          clickHandler={ (e, title) => {
                                            console.log(e, title, "clicked")
                                            let newWindow = window.open(`/data/user/${userDir}/chat-uploads/${file}`, "_blank")
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
                          </span>
                        </span>
                    )

                  })
                }
                <section style={styles.inputs(mobile)}>
                  <input type='text'
                        ref={(input) => { this.textInput = input; }}
                        onBlur={ (e)=> { this.setState({text: e.target.value }) }}
                        onKeyDown={ (e)=> {
                          if (e.which == 13) {
                            this.send(e.target.value)
                          }
                        }}
                        style={styles.text(mobile)} />
                  <input type='button' onClick={ (e) => { this.send() } } value="Send" style={styles.button} />
                  <Button title={"Upload Files"}
                          onClick={(evt, title) => {  }}
                          onFiles={ (files) => { this.props.uploadMultiple( files, this.props.username, this.props.cwd.join("/")) }}
                          image={"/data/images/upload.png"}
                          style={ styles.uploadStyle(mobile) }
                    />
              </section>
            </section>
          </span>
        </Shell>
    )

  }

}

Chat.defaultProps = {

}

import { connect } from 'react-redux';
import {
  getChatHistory,
  sendMessage
} from '../../redux/actions/message-actions'
import {
  toggleMenu,
  showChat
} from '../../redux/actions/app-actions'
import {
  uploadFiles
} from '../../redux/actions/file-actions'

export default connect(
  (state, ownProps) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        loggedIn: state.users.loggedIn,
        username: !!state.users.loggedIn ? state.users.loggedIn.name : "Human",
        user: !!state.users.loggedIn ? state.users.loggedIn : { data: {} },
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        chatOpen: state.app.chatOpen,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      sendMessage: (message, from, files, avatar) => {
          // if (message == "" && files.length == 0) {
          //   dispatch(toggleMenu())
          //   return
          // }
          dispatch(sendMessage(message, from, files, avatar))
      },
      uploadMultiple: ( files, username, dir ) => {
        dispatch( uploadFiles( files, username, dir ) )
      },
      toggleMenu: (toggle) => {
        dispatch(toggleMenu(toggle))
      },
      showChat: () => {
        dispatch(showChat())
      }
    }
  }
)(Chat)


let styles = {
  chat: {
      width: '100%'
  },
  input: {
      minHeight: '2em',
      border: 0,
      borderBottom: "0.2em solid white"
  },
  text: (mobile) => {
    return {
      width: '95%',
      border: 'none',
      background: 'rgba(0, 0, 0, 0)',
      color: 'white',
      fontSize: '1em',
      padding: '0.5em',
      borderTopLeftRadius: '3px',
      borderBottomleftRadius: '3px',
      border: '0.1em solid #2c2c2c'
    }
  },
  button: {
      background: "rgb(29, 29, 29)",
      color: "white",
      width: '100px',
      border: 'none',
      fontSize: '1em',
      padding: '0.5em',
      borderBottomRightRadius: '3px',
      borderTopRightRadius: '3px',
      position: 'absolute',
      bottom: '5px',
      right: '30px',
      height: '44px'
  },
  message : {
    display: "block",
    marginTop: '0.25em',
    marginBottom: '0.25em'
  },
  innerMessage: {
    color: "white"
  },
  username: (avatar) => {

    const usernameStyle = {
      display: 'inline-block',
      padding: '0.25em',
      color: '#f0f0f0'
    }

    if ( !!avatar ) {
      
      return {
        ...usernameStyle,
        paddingLeft: '72px',
        paddingRight: '10px',
        color: rgb(240, 240, 240),
        height: '56px',
        width: 'auto',
        backgroundImage: `url(/data/user/${avatar})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }

    } else {
      
      return {
        ...usernameStyle,
        background: "#101010",
        borderTopLeftRadius: '2px',
        borderBottomLeftRadius: '2px'
      }

    }

  },
  messageText: {
    paddingRight: '0.5em',
    padding: '0.25em',
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '2px'
  },
  messages: (mobile) => {
    return {
      width: mobile ? '100%' : '102vh',
      height: '83vh', 
      margin: 'auto auto auto 0.5em',
      textAlign: 'left',
      position: 'fixed',
      marginLeft: mobile ? 0 : '10px',
      left: mobile ? 0 : '62px',
      top: mobile ? '62px' : '68px',
      overflowY: 'auto',
      overflowX: 'hidden',
      fontSize: '13pt',
      background: '#000000e6',
      border: '0.1em solid #2c2c2c',
      borderRadius: '0.4em',
      borderBottomLeftRadius: '0.4em',
      boxShadow: 'inset #0009 0 0 300px',
      borderBottomLeftRadius: 0,
      padding: '1em'
    }
  },
  inputs: (mobile) => {
    return {
      height:'2.75em',
      position: "absolute",
      bottom: mobile ? "4px" : "-20px",
      width: (mobile ? 70: 100) + '%',
      textAlign: "left",
      left: mobile ? '56px' : '65px',
      marginLeft: '0.5em',
      bottom: '8px',
      width: '100%',
      textAlign: 'left',
      left: '0',
      marginLeft: '0.85em'
    }
  },
  uploadStyle: ( mobile ) => {
    return mobile ? {
      position: "fixed",
      bottom: "1.75em",
      right: 0
    } : { 
      marginRight: "0.25em",
      position: 'absolute',
      bottom: '44px',
      right: '13px'
    }
  }
}
