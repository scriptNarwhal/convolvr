import React, { Component } from 'react'
import Shell from '../components/shell'

const styles = {
  innerLogin: {
    width: '100%',
    minHeight: '291px',
    minWidth: '252px',
    maxWidth: '512px',
    borderRadius: '4px',
    margin: 'auto',
    display: 'block',
    position: 'relative',
    top: '6vh',
    left: '0px',
    right: '0px',
    bottom: '5vh'
  },
  title: {
    fontSize: '2em',
    paddingTop: '0.5em',
    paddingBottom: '0.66em'
  },
  subtitle: {
    fontSize: '0.5em',
    display: 'inline-block',
    maxWidth: '400px',
    background: 'rgba(0,0,0,0.1)',
    padding: '1em'
  },
  form: {
    background: 'rgba(0,0,0,0.1)',
    maxWidth: '435px',
    margin: 'auto',
    paddingTop: '1em'
  },
  label: {
    marginRight: "1em"
  },
  input: {
    background: 'transparent',
    color: 'white',
    padding: '0.5em',
    border: '2px solid rgba(255,255,255,0.25)'
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
  },
  signInButton: {
    fontSize: '1em',
    marginRight: '1em',
    color: 'white',
    border: '0',
    marginBottom: '0.5em',
    background: 'rgba(63, 0, 255, 0.37)',
    borderRadius: '2px',
    padding: '0.2em'
  },
  remember: {

  },
  rememberLabel: {

  }
}

class Login extends Component {
  componentDidMount() {
    this.state = {
      username: "",
      password: "",
      email: "",
      data: "",
      world: "overworld",
      loginError: "",
      remember: false
    }
  }
  signIn() {
    this.props.login(this.state.username, this.state.password, this.state.email, this.state.data)
    if (this.state.remember) {
      localStorage.setItem("username", this.state.username)
      localStorage.setItem("password", this.state.password)
    }
  }
  handleKeyDown (e) {
    if (e.which == 13) {
      this.signIn()
    }
  }
  rememberUser (e) {
    localStorage.setItem("rememberUser", !this.state.remember)
    this.setState({
      remember: !this.state.remember
    })
  }
  render() {
    return (
        <Shell className="login" noBackground={true}>
          <div style={styles.innerLogin}>
            <div style={styles.title}>
              Login to Convolvr Metaverse
              <span style={styles.subtitle}>
                Import 3D models, create new worlds & software in VR, with friends, in real time.
              </span>
            </div>
            <div style={styles.form}>
              <div style={styles.username}>
                <span style={styles.label}>Username</span>
                <input name="convolvr-login"
                       autoComplete="false"
                       ref={(input) => { this.nameInput = input }}
                       type='text'
                       onBlur={(e)=>{ this.setState({username: e.target.value }) }}
                       style={styles.input}
                />
              </div>
              <div style={styles.password}>
                <span style={styles.label}>Password</span>
                <input name="convolvr-password"
                       autoComplete="new-password"
                       ref={(input) => { this.passwordInput = input }}
                       type='password'
                       onKeyDown={e=> { this.handleKeyDown(e) }}
                       onBlur={(e)=>{ this.setState({password: e.target.value }) }}
                       style={styles.input}
                />
              </div>
              <div style={styles.go}>
                <input type="button"
                        value="Sign In"
                        style={styles.signInButton}
                        onClick={e=> { this.signIn() } } />
                <input type="checkbox"
                        name='remember'
                        style={styles.remember}
                        onClick={e=> this.rememberUser(e) } />
                <label htmlFor='remember'
                       style={styles.rememberLabel}
                >
                  Stay Signed In
                </label>
              </div>
            </div>
          </div>
        </Shell>
    )
  }
}

Login.defaultProps = {
}

import { connect } from 'react-redux'
import { login } from '../../redux/actions/user-actions'

export default connect(
  state => {
    return {
      tools: state.tools,
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode
    }
  },
  dispatch => {
    return {
      login: (user, pass, email, data) => {
        dispatch(login(user, pass, email, data))
      }
    }
  }
)(Login)
