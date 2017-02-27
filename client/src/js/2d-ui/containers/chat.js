/* chat container */
import React, { Component } from 'react'
import Shell from '../shell'
import Card from '../card'
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
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        fontSize: '1em',
        marginLeft: '0.15em',
        padding: '0.5em'
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
    messages: {
      width: '100%',
      minWidth: '410px',
      margin: 'auto auto auto 0.5em',
      textAlign: 'left',
      position: 'fixed',
      left: '69px',
      bottom: '58px',
      overflowY: 'auto',
      height: '93%',
      overflowX: 'hidden',
      fontSize: '14pt'
    },
    inputs: {
      minHeight: "2em",
      minWidth: "320px",
      position: "fixed",
      bottom: "0.4em",
      width: "95vw",
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
    let lastSender = ''
    return (
        <Shell className="chat"
              noBackground={true}
        >
            <section style={styles.messages} ref={ r=> { this.messageBody = r} }>
                {
                    this.props.messages.map((m, i) => {
                        let fromLabel = m.from != lastSender || (m.files != null && m.files.length > 0) ?
                            (<span style={styles.username}>{m.from}:</span>) : ''
                        lastSender = m.from
                        return (
                        <span key={i} style={styles.message} >
                          <span style={styles.innerMessage}>
                            { fromLabel }
                            <span style={styles.messageText}>{m.message}</span>
                            { m.files != null ? <br style={{marginBottom: '0.5em'}} /> : '' }
                            {
                              m.files != null && m.files.map((file, i) => {
                                  return (
                                    <Card image={this.isImage(file) ? `/data/${m.from}/chat-uploads/thumbs/${file}.jpg` : ''}
                                          clickHandler={ (e, title) => {
                                            console.log(e, title, "clicked")
                                            let newWindow = window.open(`/data/${m.from}/chat-uploads/${file}`, "_blank")
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
