/* chat container */
import React, { Component } from 'react'
import Shell from '../shell'
import LocationBar from '../location-bar'

const styles = {
    chat: {
        width: '100%'
    },
    input: {
        minHeight: '2em',
        border: 0,
        borderBottom: "0.2em solid white"
    },
    text: {
        width: '70%',
        border: 'none',
        background: '#202020',
        color: 'white',
        fontSize: '1em',
        marginLeft: '0.15em',
        padding: '0.5em'
    },
    button: {
        background: "#444444",
        color: "white",
        width: '15%',
        border: 'none',
        fontSize: '1em',
        padding: '0.5em'
    },
    message : {
      display: "block",
      marginBottom: "0.5em"
    },
    innerMessage: {
      background: "#101010",
      color: "white",
      padding: "0.25em"
    },
    username: {
      paddingRight: '0.66em',
      color: '#f0f0f0'
    },
    messageText: {

    },
    messages: {
      width: '100%',
      minWidth: '410px',
      margin: 'auto auto auto 0.5em',
      textAlign: 'left',
      position: 'fixed',
      left: '68px',
      bottom: '50px',
      overflowY: 'auto',
      height: '93%',
      overflowX: 'hidden',
      fontSize: '12pt'
    },
    inputs: {
      minHeight: "2em",
      minWidth: "480px",
      position: "fixed",
      bottom: "1vh",
      width: "48vw",
      textAlign: "left",
      left: '65px',
      marginLeft: '0.5em'
    }
}

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
    const scrollHeight = this.messageBody.scrollHeight,
          height = this.messageBody.clientHeight,
          maxScrollTop = scrollHeight - height
    this.messageBody.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0
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
    return /(.png|.jpg|.jpeg|.gif|webp)/.test(file)
  }
  render() {
    return (
        <Shell className="chat"
              noBackground={true}
        >
          <LocationBar path={this.props.workingPath}
                       label="Chat"
                       username={this.props.username}
                       onItemSelect={  (item, index, length) => {

                       }}
          />
            <section style={styles.messages} ref={ r=> { this.messageBody = r} }>
                {
                    this.props.messages.map((m, i) => (
                        <span key={i} style={styles.message} >
                          <span style={styles.innerMessage}>
                            <span style={styles.username}>{m.from}:</span>
                            <span style={styles.messageText}>{m.message}</span>
                            { m.files != null ? <br /> : '' }
                            {
                              m.files != null && m.files.map((file, i) => {
                                  return (
                                    <a title={file} href={`/data/${m.from}/chat-uploads/${file}`} key={i} target="_blank">
                                      {this.isImage(file) ?
                                        <img src={`/data/${m.from}/chat-uploads/thumbs/${file}.jpg`}
                                           style={{maxWidth: '320px'}}
                                           title={file}
                                           alt={file}
                                        /> : file
                                      }
                                    </a>
                                  )
                              })
                            }
                          </span>
                        </span>
                    ))
                }
            </section>
            <section style={styles.inputs}>
                <input type='text'
                       ref={(input) => { this.textInput = input; }}
                       onBlur={ (e)=> { this.setState({text: e.target.value }) }}
                       onKeyDown={ (e)=> {
                         if (e.which == 13) {
                           this.send(e.target.value)
                         }
                       }}
                       style={styles.text} />
                <input type='button' onClick={ (e) => { this.send() } } value="Send" style={styles.button} />
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
export default connect(
  (state, ownProps) => {
    return {
        loggedIn: state.users.loggedIn,
        username: state.users.loggedIn != false ? state.users.loggedIn.name : "Human",
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
      toggleMenu: (toggle) => {
        dispatch(toggleMenu(toggle))
      },
      showChat: () => {
        dispatch(showChat())
      }
    }
  }
)(Chat)
