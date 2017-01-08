/* chat container */
import React, { Component } from 'react';
import Shell from '../components/shell';

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
        background: 'black',
        color: 'white',
        fontSize: '1em',
        marginLeft: '0.15em'
    },
    button: {
        background: "black",
        color: "white",
        width: '15%',
        fontSize: '1em'
    },
    message : {
      display: "block",
      marginRight: "50%",
      minWidth: "410px",
      marginBottom: "0.5em"
    },
    innerMessage: {
      background: "black",
      color: "white",
      padding: "0.25em"
    },
    username: {
      paddingRight: '0.66em'
    },
    messageText: {

    },
    messages: {
      width: "85vw",
      minWidth: "410px",
      margin: "auto",
      textAlign: "left",
      position: "fixed",
      left: '10.5vh',
      marginLeft: '0.5em',
      bottom: '2.5em'
    },
    inputs: {
      minHeight: "2em",
      minWidth: "480px",
      position: "fixed",
      bottom: "1vh",
      width: "48vw",
      textAlign: "left",
      left: '10.5vh',
      marginLeft: '0.5em'
    }
}

class Chat extends Component {
  constructor() {
    super()
    this.state = {
        text: ""
    }
  }
  componentDidMount () {
    this.textInput.focus()
  }
  send (message) {
      console.log("send button")
      let from = this.props.username
      this.props.sendMessage(message || this.state.text, from)
      this.setState({
        text: ""
      })
      this.textInput.value = ""
  }
  render() {
    return (
        <Shell className="chat">
            <section style={styles.messages}>
                {
                    this.props.messages.map((m, i) => (
                        <span key={i} style={styles.message} >
                          <span style={styles.innerMessage}>
                            <span style={styles.username}>{m.from}:</span>
                            <span style={styles.messageText}>{m.message}</span>
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
    sendMessage
} from '../redux/actions/message-actions'

export default connect(
  (state, ownProps) => {
    return {
        loggedIn: state.users.loggedIn,
        username: state.users.loggedIn != false ? state.users.loggedIn.name : "Human",
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      sendMessage: (message, from) => {
          dispatch(sendMessage(message, from))
        }
      }
  }
)(Chat)