/* chat container */
import React, { Component } from 'react';
import Shell from '../components/shell';

const styles = {
    chat: {
        width: '100%'
    },
    input: {
        minHeight: '2em'
    },
    text: {
        width: '70%',
        background: "black",
        color: "white"
    },
    button: {
        background: "black",
        color: "white",
        width: '15%'
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
    messages: {
      width: "85vw",
      minWidth: "410px",
      margin: "auto",
      textAlign: "left",
      position: "fixed",
      left: "2vw",
      bottom: "7vh"
    },
    inputs: {
      minHeight: "2em",
      minWidth: "480px",
      position: "fixed",
      bottom: "1vh",
      width: "48vw",
      textAlign: "left",
      left: "2vw"
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

  }
  send (message) {
      console.log("send button")
      this.props.sendMessage(message || this.state.text)
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
                    this.props.messages.map(m => (
                        <span style={styles.message} >
                          <span style={styles.innerMessage}>
                            {m}
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
        messages: state.messages.messages,
        stereoMode: state.app.stereoMode,
        menuOpen: state.app.menuOpen,
        vrMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      sendMessage: (message) => {
          dispatch(sendMessage(message))
        }
      }
  }
)(Chat)
