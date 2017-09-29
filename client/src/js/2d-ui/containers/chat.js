/* chat container */
import React, { Component } from 'react'
import Shell from '../components/shell'
import Card from '../components/card'
import Button from '../components/button'
import LocationBar from '../components/location-bar'

const styles = {
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
        width: (mobile ? 47: 70) + '%',
        border: 'none',
        background: 'rgba(0, 0, 0, 0.498039)',
        color: 'white',
        fontSize: '1em',
        marginLeft: '0.15em',
        padding: '0.5em',
        boxShadow: 'inset 0px -1px 0px 1px rgba(255, 255, 255, 0.4)',
        borderLeftTopRadius: '3px',
        borderTopLeftRadius: '3px',
        borderBottomLeftRadius: '3px'
      }
    },
    button: {
        background: "rgb(29, 29, 29)",
        color: "white",
        width: '100px',
        border: 'none',
        fontSize: '1em',
        padding: '0.5em',
        borderTopRightRadius: '3px',
        borderBottomRightRadius: '3px'
    },
    message : {
      display: "block",
      marginTop: '0.25em',
      marginBottom: '0.25em'
    },
    innerMessage: {
      color: "white"
    },
    username: {
      padding: '0.25em',
      color: '#f0f0f0',
      background: "#101010",
      display: 'inline-block',
      borderTopLeftRadius: '2px',
      borderBottomLeftRadius: '2px'
    },
    messageText: {
      paddingRight: '0.5em',
      background: "#101010",
      padding: '0.25em',
      borderTopRightRadius: '2px',
      borderBottomRightRadius: '2px'
    },
    messages: (mobile) => {
      return {
        width: '100%',
        minWidth: '410px',
        margin: 'auto auto auto 0.5em',
        textAlign: 'left',
        position: 'fixed',
        left: mobile ? 0 : '65px',
        bottom: '58px',
        top: mobile ? '162px' : 0,
        overflowY: 'auto',
        height: '93%',
        overflowX: 'hidden',
        fontSize: '14pt'
      }
    },
    inputs: (mobile) => {
      return {
        minHeight: "2em",
        minWidth: "320px",
        position: "fixed",
        bottom: mobile ? "0.4em" : "-20px",
        width: (mobile ? 70: 70) + '%',
        textAlign: "left",
        left: mobile ? 0 : '65px',
        marginLeft: '0.5em'
      }
    },
    uploadStyle: ( mobile ) => {
      return mobile ? {
        position: "fixed",
        bottom: "1.75em",
        right: 0
      } : { 
        marginRight: "0.25em", top: "-1.2em", position: "relative"
      }
    }
}

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
      let from = this.props.username
      this.props.sendMessage(message || this.state.text, from, files)
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
            <section style={styles.messages(mobile)} ref={ r=> { this.messageBody = r} }>
                {
                    this.props.messages.map((m, i) => {
                        let fromLabel = m.from != lastSender || (m.files != null && m.files.length > 0) ?
                            (<span style={styles.username}>{m.from}:</span>) : ''
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
            </section>
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
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        chatOpen: state.app.chatOpen,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      sendMessage: (message, from) => {
          dispatch(sendMessage(message, from))
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
