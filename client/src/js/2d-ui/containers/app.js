import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { events } from '../../network/socket'
import { fetchUsers } from '../../redux/actions/user-actions'
import Shell from '../components/shell'
import Button from '../components/button'
import { vrAnimate } from '../../world/render'

class App extends Component {

  componentWillMount () {

    this.state = {
      unread: 0,
      lastSender: ''
    }
    this.props.fetchWorlds()

    events.on("chat message", message => {

      let chatMessage = JSON.parse(message.data),
          chatUI = three.world.chat,
          worldName = '',
          from = ''
    	this.props.getMessage(chatMessage.message, chatMessage.from, chatMessage.files)

      if (this.state.lastSender != chatMessage.from || (chatMessage.files != null && chatMessage.files.length > 0)) {
        from = `${chatMessage.from}: `
      }

      this.setState({
        lastSender: chatMessage.from
      })

      chatUI.componentsByProp.text[0].state.text.write(`${from}${chatMessage.message}`) // can batch this without re-rendering each time
      chatUI.componentsByProp.text[0].state.text.update()

      this.notify(chatMessage.message, chatMessage.from)
      worldName = this.props.world == "overworld" ? "Convolvr" : this.props.world

      if (this.props.focus == false) {

        this.setState({
          unread: this.state.unread +1
        })

        if (this.state.unread > 0) {
            document.title = `[${this.state.unread}] ${worldName}`
        }

      } else {
        document.title = worldName
      }

      let worldMode = three.world.mode
      if (!this.props.menuOpen) {
        browserHistory.push("/chat")

        if (worldMode != 'vr' && worldMode != 'stereo') { // 3d ui will show the chat in vr without interrupting things
          this.props.toggleMenu()
        } else {
          setTimeout(()=>{
            browserHistory.push(`/world/${this.props.world}`)
            this.props.toggleMenu()
          }, 3500)
        }

      }

    })

    this.props.fetchUniverseSettings()

    setTimeout(()=> {

      let world = three.world,
          worldName = this.props.world

      let initChatUI = () => { // rename this to something more descriptive
        let world = window.three.world
        world.chat.update([0, (world.terrain.voxels["0.0.0"].data.altitude) - 52000, -5000])
        world.help.update([-80000, (world.terrain.voxels["0.0.0"].data.altitude) - 52000, -5000])
        three.camera.position.y = (world.terrain.voxels["0.0.0"].data.altitude) + 20000
        three.world.user.velocity.y = -10000
      }

      world.load(worldName, ()=> {
        setTimeout(()=>{
          initChatUI() // wait for world & terrain to load before placing this
        }, 1200)
      })

    }, 100)

    setTimeout(()=>{
      this.props.getChatHistory(0) // wait a fraction of a second for the world to load / to show in 3d too
    }, 200)

    window.document.body.addEventListener("keydown", (e)=>this.handleKeyDown(e), true)

    if (window.location.href.indexOf("/chat") > -1 ||
        window.location.href.indexOf("/login") > -1) {
      this.props.toggleMenu(true);
    }
    // detect user credentials
    let rememberUser = localStorage.getItem("rememberUser"),
        username = '',
        password = '',
        autoSignIn = false

    if (rememberUser != null) {

      username = localStorage.getItem("username")
      password = localStorage.getItem("password")

      if (username != null && username != '') {

        autoSignIn = true
        this.props.login(username, password, "", "")

      }
    }

    if (!autoSignIn && this.props.loggedIn == false && window.location.href.indexOf("/chat") >-1) {
      browserHistory.push("/login")
    }

    window.onblur = () => {
      this.props.setWindowFocus(false)
      three.world.windowFocus = false
    }

    window.onfocus = () => {
      this.props.setWindowFocus(true)
      three.world.windowFocus = true
      three.world.user.velocity.y = 0
      this.setState({
        unread: 0
      })
    }

    let renderCanvas = document.querySelector("#viewport")

    renderCanvas.onclick = (event) => {

      let elem = event.target,
          uInput = window.three.world.userInput

      if (!uInput.fullscreen) {

						elem.requestPointerLock()
            this.props.toggleMenu(false)

      }

    }

  }

  handleKeyDown (e) {
    if (e.which == 27) {
      this.props.toggleMenu(true)
    }
    if (e.which == 13) {
      if (!this.props.menuOpen) {
        this.props.toggleMenu(true);
        browserHistory.push("/chat")
      }
    }
  }

  goBack () {
    browserHistory.push(`/world/${this.props.world}`)
  }

  notify (chatMessage, from) {
    function doNotification() {
      function onNotifyShow() {
          console.log('notification was shown!');
      }
      let Notify = window.Notify.default,
          myNotification = new Notify(`Message from ${from}`, {
          body: chatMessage,
          notifyShow: onNotifyShow
      });
      myNotification.show()
    }
    function onPermissionGranted() {
        console.log('Permission has been granted by the user');
        doNotification();
    }
    function onPermissionDenied() {
        console.warn('Permission has been denied by the user');
    }
    if (!Notify.needsPermission) {
        doNotification();
    } else if (Notify.isSupported()) {
        Notify.requestPermission(onPermissionGranted, onPermissionDenied);
    }
  }

  renderVRButtons () {
    return this.props.stereoMode ?
        [<Button title="Reset Pose"
                id="reset-pose"
                style={{
                  position: 'fixed',
                  right: '10vh',
                  bottom: 0
                }}
                key='1'
                image="/data/images/x.png"
                onClick={ (evt, title) => {

                } }
        />,
        <Button title="Exit VR"
                style={{
                  position: "fixed",
                  right: 0,
                  top: 0
                }}
                key='2'
                image="/data/images/x.png"
                onClick={ (evt, title) => {
                    this.props.toggleVRMode();
                } }
        />]
       : <Button title="Enter VR"
                  style={{
                      position: "fixed",
                      right:0,
                      bottom: 0,
                      zIndex: 9999,
                      background: 'none'
                  }}
                  image="/data/images/vr.png"
                  onClick={ (evt, title) => {
                    this.props.toggleVRMode()
                    let renderer = three.renderer,
                        ratio = window.devicePixelRatio || 1,
                        camera = three.camera,
                        scene = three.scene,
                        controls = null,
                        effect = null

                        if (three.vrControls == null) {
                          window.WebVRConfig = {
                            MOUSE_KEYBOARD_CONTROLS_DISABLED: true,
                            TOUCH_PANNER_DISABLED: true
                          }
                          controls = new THREE.VRControls(camera)
                          if (!three.world.mobile) {
                            renderer.autoClear = false
                          }
                          effect = new THREE.VREffect(renderer, three.world.postProcessing)
                          effect.scale = 22000
                          effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio)
                          three.vrEffect = effect
                          three.vrControls = controls

                          function onResize() {
                            let ratio = window.devicePixelRatio || 1
                            effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio)
                          }
                          function onVRDisplayPresentChange() {
                            console.log('onVRDisplayPresentChange')
                            onResize()
                          }
                          // Resize the WebGL canvas when we resize and also when we change modes.
                          window.addEventListener('resize', onResize);
                          window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
                          console.log("vrDisplay", three.vrDisplay)
                          if (three.vrDisplay != null) {
                            three.vrDisplay.requestPresent([{source: renderer.domElement}]);
                            three.vrDisplay.requestAnimationFrame(()=> { // Request animation frame loop function
                              vrAnimate(Date.now(), [0,0,0], 0)
                            })
                          } else {
                            alert("Connect VR Display and then reload page.")
                          }
                          //  setTimeout(() => {
                          //    document.querySelector('#reset-pose').addEventListener('click', function() {
                          //      three.vrDisplay.resetPose();
                          //    });
                          //  }, 500)
                      }
                      this.props.toggleVRMode()
                      three.world.mode = three.world.mode != "stereo" ? "stereo" : "web"
                      three.world.onWindowResize()
                  }
                }
            />
  }
  render() {
    return (
        <div className="root">
         <Shell noBackground={true}
                hasMenu={true}
                menuOnly={true}
                menuOpen={this.props.menuOpen} ></Shell>
         { this.renderVRButtons() }
         <Button title="Close Menu"
                 image="/data/images/x.png"
                 style={{
                     position: "fixed",
                     right:0,
                     top: 0,
                     zIndex: 9999999,
                     background: 'transparent',
                     display: !this.props.menuOpen ? "none" : "inline-block"
                 }}
                 onClick={ (evt, title) => {
                     this.props.toggleMenu(false)
                     this.goBack()
                     //browserHistory.push("/menu")
                 } }
                 key={2}
         />
            {this.props.children}
            <div className="lightbox" style={{display: "none"}}></div>
            <canvas id="webcam-canvas"></canvas>
            <video id='local-video' style={{display:'none'}}></video>
            <video id='remote-video' style={{display:'none'}}></video>
            <input type='button' value='Video Call' style={{display:'none'}} id='videoCallButton' />
            <input type='button' value='End Call' style={{display:'none'}} id='endCallButton' />
        </div>
    )
  }
}

App.defaultProps = {

}

import { connect } from 'react-redux'
import {
  toggleMenu,
  toggleVR,
  setWindowFocus,
  showChat
} from '../../redux/actions/app-actions'
import {
  fetchWorlds,
  setCurrentWorld,
  fetchUniverseSettings
} from '../../redux/actions/world-actions'
import {
  getChatHistory,
  getMessage
} from '../../redux/actions/message-actions'
import { login } from '../../redux/actions/user-actions'

export default connect(
  state => {
    return {
      loggedIn: state.users.loggedIn,
      tools: state.tools,
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode,
      focus: state.app.windowFocus,
      world: state.worlds.current
    }
  },
  dispatch => {
    return {
      fetchUniverseSettings: ()=> {
        dispatch(fetchUniverseSettings())
      },
      login: (user, pass, email, data) => {
            dispatch(login(user, pass, email, data))
      },
      getMessage: (message, from, files) => {
          dispatch(getMessage(message, from, files))
      },
      showChat: () => {
        dispatch(showChat())
      },
      getChatHistory: (skip) => {
        dispatch(getChatHistory(skip))
      },
      toggleMenu: (force) => {
          window.three.world.mode = force ? "vr" : "web"
          dispatch(toggleMenu(force))
      },
      fetchWorlds: () => {
          dispatch(fetchWorlds())
      },
      setCurrentWorld: (world) => {
        dispatch(setCurrentWorld(world))
      },
      setWindowFocus: (t) => {
        dispatch(setWindowFocus(t))
      },
      toggleVRMode: () => {
          dispatch(toggleVR())
      }
    }
  }
)(App)
