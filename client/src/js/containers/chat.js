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
        width: '70%'
    },
    button: {
        width: '15%'
    }
}

class Chat extends Component {
  componentDidMount () {
        this.state = {
            text: ""
        }
  }
  send () {
      this.props.sendMessage(this.state.text)
  }
  render() {
    return (
        <Shell className="chat">
            <section style={styles.chat}>
                {
                    this.props.messages.map(m => (
                        <span style={styles.message} >{m}</span>
                    ))
                }
            </section>
            <section style={styles.input}>
                <input type='text' onBlur={ (e)=> { this.setState({text: e.target.value }) }} style={styles.text} />
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
