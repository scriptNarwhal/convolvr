import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import Shell from '../components/shell'
import { 
  textAreaStyle,
  basicInputStyle,
  lightboxStyle, 
  modalStyle 
} from '../styles'
import { isMobile } from '../../config'

class Login extends Component {
  componentDidMount() {
    this.state = {
      username: "",
      password: "",
      email: "",
      data: {},
      world: "overworld",
      loginError: "",
      remember: false
    }
  }

  logIn () {

    this.props.login(this.state.username, this.state.password, this.state.email, this.state.data)

    if (this.state.remember) { // replace password with token before beta release
      localStorage.setItem("username", this.state.username)
      localStorage.setItem("password", this.state.password)
    }

  }

  signUp () {

    this.props.logout()
    browserHistory.push("/profile")

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
          <div style={styles.modal()}>
            <div style={styles.title}>
              Sign in to Convolvr Metaverse
            </div>
            <span style={styles.subtitle}>
                Build machines, art & software in VR, with friends, in real time.
              </span>
              <span style={ styles.subtitle }>
                Run your own server, contribute or learn more on <a href="https://github.com/Convolvr/convolvr">Github</a>
              </span>
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
                        value="Log In"
                        style={styles.signInButton}
                        onClick={e=> { this.logIn() } } 
                /> 
                <input type="button"
                        value="Sign Up"
                        style={styles.signUpButton}
                        onClick={e=> { this.signUp() } } 
                />     
                <input type="checkbox"
                        name='remember'
                        style={styles.remember}
                        onClick={e=> this.rememberUser(e) } 
                />
                <label htmlFor='remember'
                       style={styles.rememberLabel}
                >
                  Remember Me
                </label>
              </div>
            </div>
          </div>
        </Shell>
    )

  }

}

Login.defaultProps = {}

import { connect } from 'react-redux'
import { 
  logOut,
  login 
} from '../../redux/actions/user-actions'

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
      logout: () => {
        dispatch( logOut() )
      },
      login: (user, pass, email, data) => {
        dispatch(login(user, pass, email, data))
      }
    }
  }
)(Login)

const styles = {
  modal: () => {
    return Object.assign({}, modalStyle(isMobile()), {
        maxWidth: '1080px',
        bottom: undefined,
        top: '1em',
        height: '85vh',
        left: '0px'
      })
  },
  title: {
    fontSize: '2em',
    paddingTop: '0.5em',
    paddingBottom: '0.66em'
  },
  subtitle: {
    fontSize: '1em',
    display: 'block',
    background: 'rgba(0,0,0,0.1)',
    padding: '0.5em',
    paddingBottom: '0.5em',
    paddingLeft: '2em',
    paddingRight: '2em',
    marginTop: '1em',
    marginBottom: '1em'
  },
  form: {
    background: 'rgba(0,0,0,0.1)',
    maxWidth: '530px',
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
  signUpButton: {
    fontSize: '1em',
    marginRight: '1em',
    color: 'white',
    border: '0',
    marginBottom: '0.5em',
    background: 'rgba(0, 255, 63, 0.37)',
    borderRadius: '2px',
    padding: '0.2em'
  },
  remember: {
    width: '1.5em',
    height: '1.5em',
    display: 'inline-block',
    marginRight: '0.5em'
  },
  rememberLabel: {

  }
}