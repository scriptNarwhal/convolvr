/* chat container */
import * as React from "react"; import { Component } from "react";
import Shell from '../components/shell'
import Card from '../components/card'
import Button from '../components/button'
import { withRouter } from 'react-router-dom'
import LocationBar from '../components/location-bar'
import { rgba, rgb } from '../../util'

let linkRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm,
    imageRegex = /(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)/

class Chat extends Component<any, any> {

  public messageBody: any
  public textInput: any

  handleBGClick (e: any) {
    if (e.target.getAttribute("id") == "bg-toggle-menu") {
      this.props.toggleMenu(false)
      this.props.history.push("/")

    }
  }

  componentDidMount () {

    let worldMode = (window as any).three.world.mode

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

  send (message?: string, files: any[] = []) {
      let from = this.props.username,
          avatar = this.props.user.data.profilePicture

      this.props.sendMessage(message || this.state.text, from, files, avatar, this.props.space)
      this.setState({
        text: ""
      })
      this.textInput.value = ""

  }

  isImage (file: string) {

    return imageRegex.test(file)

  }

  renderMessage (message: string) {

    if (linkRegex.test(message)) {
      if (imageRegex.test(message)) {
        return (
            <Card image={message}
                  clickHandler={ (e: any, title: string) => {
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
        mobile = window.innerWidth <= 720,
        currentSpace = this.props.space;

    return (
        <Shell htmlClassName="chat"
              noBackground={true}
        >
         <span style={{ width: '100%', height: '100%', position:'fixed', top: 0, left: 0}}
              onClick={ (e: any) => { this.handleBGClick(e) } }
              id="bg-toggle-menu" 
        >
            <section style={styles.messages(mobile) as any} ref={ r=> { this.messageBody = r} }>
                {
                    this.props.messages.map((m: any, i: number) => {
                        let fromLabel = m.from != lastSender || (m.files != null && m.files.length > 0) ?
                            (<span style={styles.username(m.avatar)} >{m.from}:</span>) : ''
                        lastSender = m.from
                        // if (m.space != currentSpace) {
                        //   return "";
                        // }
                        return (
                        <span key={i} style={styles.message} >
                          <span style={styles.innerMessage}>
                            { fromLabel }
                            <span style={styles.messageText}>{this.renderMessage(m.message)}</span>
                            { m.files != null ? <br style={{marginBottom: '0.5em'}} /> : '' }
                            {
                              m.files != null && m.files.map((file: any, i: number) => {
                                  let userDir = m.from != 'Human' ? m.from : 'public'
                                  return (
                                    <Card image={this.isImage(file) ? `/data/user/${userDir}/chat-uploads/thumbs/${file}.jpg` : ''}
                                          clickHandler={ (e: any, title: string) => {
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
            <section style={styles.inputs(mobile) as any}>
                  <input type='text'
                        ref={(input: any) => { this.textInput = input; }}
                        onBlur={ (e: any)=> { this.setState({text: e.target.value }) }}
                        onKeyDown={ (e: any)=> {
                          if (e.which == 13) {
                            this.send((e.target as any).value)
                          }
                        }}
                        style={styles.text(mobile)} />
                  <input type='button' onClick={ (e: any) => { this.send() } } value="Send" style={styles.button(mobile) as any} />
                  <Button title={"Upload Files"}
                          onClick={(evt: any, title: string) => {  }}
                          onFiles={ (files: any[]) => { this.props.uploadMultiple( files, this.props.username, this.props.cwd.join("/")) }}
                          image={"/data/images/upload.png"}
                          style={ styles.uploadStyle(mobile) }
                    />
              </section>
          </span>
        </Shell>
    )
  }
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
  (state: any, ownProps: any) => {
    return {
        cwd: state.files.listDirectories.workingPath,
        loggedIn: state.users.loggedIn,
        username: !!state.users.loggedIn ? state.users.loggedIn.name : "Human",
        user: !!state.users.loggedIn ? state.users.loggedIn : { data: {} },
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        chatOpen: state.app.chatOpen,
        vrMode: state.app.vrMode,
        space: state.spaces.current
    }
  },
  (dispatch: any) => {
    return {
      sendMessage: (message: string, from: string, files: any[], avatar: string, space: string) => {
          // if (message == "" && files.length == 0) {
          //   dispatch(toggleMenu())
          //   return
          // }
          console.log("send message", message, space)
          dispatch(sendMessage(message, from, files, avatar, space))
      },
      uploadMultiple: ( files: any[], username: string, dir: string ) => {
        dispatch( uploadFiles( files, username, dir ) )
      },
      toggleMenu: (toggle: boolean) => {
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
  text: (mobile: boolean) => {
    return {
      width: '100%',
      border: 'none',
      background: 'black',
      color: 'white',
      fontSize: '1em',
      padding: '11px',
      paddingLeft: '26px',
      borderRadius: '3px',
      // borderTopLeftRadius: '3px',
      // borderBottomleftRadius: '3px',
    }
  },
  button: (mobile: boolean) => {
    return {
      background: 'black',
      color: '#00d0ff',
      width: '100px',
      fontSize: '1em',
      padding: '0.35em',
      borderBottomRightRadius: '3px',
      borderTopRightRadius: '3px',
      position: mobile ? 'fixed' : 'absolute',
      bottom: mobile ? '65px' : '13px',
      right: '4px',
      height: '39px',
      border: '0.1em solid blue',
      textTransform: 'uppercase',
      cursor: 'pointer'
    }
  },
  message : {
    display: "block",
    marginTop: '0.25em',
    marginBottom: '0.25em'
  },
  innerMessage: {
    color: "white"
  },
  username: (avatar: string) => {
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
        background: "hsl(225, 82%, 26%)",
        borderBottom: "#0b1c4d 2px solid",
        borderRadius: "3px"
      }
    }
  },
  messageText: {
    paddingRight: '0.5em',
    padding: '0.25em',
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '2px'
  },
  messages: (mobile: boolean) => {
    return {
      width: mobile ? '100%' : '102vh',
      height: mobile ? '76vh' : '86vh',
      minWidth: '40vw',
      maxHeight: '82vh', 
      margin: 'auto auto auto 0.5em',
      textAlign: 'left',
      position: 'fixed',
      marginLeft: mobile ? 0 : '10px',
      left: mobile ? 0 : '62px',
      bottom: mobile ? '58px' : '38px',
      overflowY: 'auto',
      overflowX: 'hidden',
      fontSize: '12pt',
      background: 'black',
      borderRadius: '0.5em',
      boxShadow: 'rgba(0, 0, 0, 0.65) 0em 0.75em 5em, rgba(0,0,0,0.65) 0em 0.2em 0.25em',
      padding: '1em'
    }
  },
  inputs: (mobile: boolean) => {
    return {
      border: '#2d2d2d solid 0.1em',
      height:'2.75em',
      position: "fixed",
      // bottom: mobile ? "4px" : "-20px",
      width: (mobile ? '100%': '105vh'),
      maxWidth: mobile ? '100%' : '85vw',
      textAlign: "left",
      left: mobile ? '0px' : '22px',
      bottom: mobile ? '60px' : '-10px',
      minWidth: '42vw',
      marginLeft: '2.5em',
      marginRight: '2%'
    }
  },
  uploadStyle: (mobile: boolean) => {
    return mobile ? {
      position: "fixed",
      bottom: "96px",
      right: 0
    } : { 
      marginRight: "0.25em",
      position: 'absolute',
      bottom: '44px',
      right: '13px'
    }
  }
}
