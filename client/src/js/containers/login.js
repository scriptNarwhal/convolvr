import React, { Component } from 'react';
import Shell from '../components/shell';

const styles = {
  innerLogin: {
    width: "60vh",
    height: "38vh",
    minHeight: "320px",
    minWidth: "320px",
    margin: "auto",
    display: "block",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "5vh",
    border: "rgb(26, 252, 30) solid 0.5vh",
    background: "rgba(0, 0, 0, 0.76)"
  },
  title: {
    fontSize: "4vh",
    paddingTop: "3.5vh",
    paddingBottom: "5vh"
  },
  form: {

  },
  label: {
    marginRight: "1em"
  },
  username: {
    marginBottom: "1em"
  },
  password: {
    marginBottom: "1em"
  },
  go: {

  },
  submit: {
    fontSize: "5vh",
    color: "#929292",
    background: "rgb(255, 255, 255)",
    borderRadius: "0.2vh",
    border: "rgb(107, 104, 104) 0.4vh solid",
    cursor: "pointer"
  }
}

export default class Login extends Component {
  componentDidMount() {
    this.state = {
      username: "",
      password: "",
      world: "overworld",
      loginError: ""
    }
  }

  signIn() {

  }

  render() {
    return (
        <Shell className="login">
          <div style={styles.innerLogin}>
            <div style={styles.title}>
              Sign in to Convolvr
            </div>
            <div style={styles.form}>
              <div style={styles.username}>
                <span style={styles.label}>Username</span>
                <input type='text' onBlur={(e)=>{ this.setState({username: e.target.value }) }} />
              </div>
              <div style={styles.password}>
                <span style={styles.label}>Password</span>
                <input type='password' onBlur={(e)=>{ this.setState({password: e.target.value }) }} />
              </div>
              <div style={styles.go}>
                <input type="button" value="Enter" onClick={e=> { this.signIn() } } />
              </div>
            </div>
          </div>
        </Shell>
    )
  }
}

Login.defaultProps = {

}
