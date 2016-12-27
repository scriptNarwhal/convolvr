/* chat container */
import React, { Component } from 'react';
import Shell from '../components/shell';

const styles = {
    chat: {

    },
    input: {

    },
    text: {

    },
    button: {

    }
}

export default class Chat extends Component {
  componentDidMount () {
        this.state = {
            text: ""
        }
  }

  render() {
    return (
        <Shell className="chat">
            <section style={styles.chat}>

            </section>
            <section style={styles.input}>
                <input type='text' onBlur={ (e)=> { this.setState({text: e.target.value }) }} style={styles.text} />
                <input type='button' onClick={ (e) => { this.send() } } style={styles.button} />
            </section>
        </Shell>
    )
  }
}

Chat.defaultProps = {

}
