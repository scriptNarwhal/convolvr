import * as React from "react"; import { Component } from "react";
import { withRouter } from 'react-router-dom'
import { events } from '../../network/socket'
import Shell from '../components/shell'
import Button from '../components/button'
import { vrAnimate } from '../../world/render'
import { 
  detectSpaceDetailsFromURL,
  GRID_SIZE,
  APP_NAME
} from '../../config'

class App extends Component<any, any> {

  componentWillMount () {

    this.state = {
      unread: 0,
      lastSender: ''
    }

    this.props.fetchSpaces()
    this.props.getInventory(this.props.username, "Entities")
    this.props.getInventory(this.props.username, "Components")
    this.props.getInventory(this.props.username, "Properties")

    let world = three.world, 
        worldDetails = detectSpaceDetailsFromURL()

    events.on("chat message", message => {

      let m = JSON.parse( message.data ),
          chatUI = three.world.chat,
          chatText = chatUI ? chatUI.componentsByAttr.text[ 0 ] : "",
          worldName = '',
          from = ''

      if (!!!m.space || m.space != this.props.world) {
        return
      }
    	this.props.getMessage(m.message, m.from, m.files, m.avatar, m.space)

      if (this.state.lastSender != m.from || (m.files != null && m.files.length > 0)) {
        from = `${m.from}: `
      }

      this.setState({
        lastSender: m.from
      })

      this.notify(m.message, m.from)
      worldName = this.props.world.toLowerCase() == "overworld" ? APP_NAME : this.props.world

      if ( this.props.focus == false ) {
        this.setState({
          unread: this.state.unread +1
        })

        if (this.state.unread > 0)
          document.title = `[${this.state.unread}] ${worldName}`

      } else {
        document.title = worldName
      }

      let worldMode = three.world.mode,
          worldUser = worldDetails[ 0 ]

      if ( !this.props.menuOpen ) {
        // TODO: implement show chat modal
        // world.chatModal.componentsByAttr.text[0].state.text. 
      }
    })

    this.props.fetchUniverseSettings()
    setTimeout( ()=> { console.log("world & worldUser ", worldDetails[0], worldDetails[1] )
      let respawnCamera = () => {

        let cameraPos = world.three.camera.position,
            voxelKey = `${Math.floor(cameraPos.x / GRID_SIZE[ 0 ])}.0.${Math.floor(cameraPos.z / GRID_SIZE[ 2 ])}`,
            altitude = 0

        if ( world.terrain.voxels[ voxelKey ] ) {
          altitude = (world.terrain.voxels[ voxelKey ].data.altitude)
          three.camera.position.set( cameraPos.x+Math.random()*2, world.terrain.voxels[ voxelKey ].data.altitude / 10000, cameraPos.z+Math.random()*2) + 7
        }
        three.world.user.velocity.y = -1000
      }

      world.load( worldDetails[ 0 ], worldDetails[ 1 ], () => { /* systems online */ }, ()=> { /* terrain finished loading */
        console.log("init 3d UI / terrain loaded")
        respawnCamera()
      })
    }, 100)

    world.initChatAndLoggedInUser = ( doLogin = false ) => {
      this.props.getChatHistory(world.name, 0) // wait a fraction of a second for the world to load / to show in 3d too
      if ( doLogin ) {
        let rememberUser = localStorage.getItem("rememberUser"), // detect user credentials // refactor this...
        username = '',
        password = '',
        autoSignIn = false
  
        if (rememberUser != null) {
          username = localStorage.getItem("username") // refactor this to be more secure before beta 0.6
          password = localStorage.getItem("password")
          if (username != null && username != '') {
            autoSignIn = true
            this.props.login(username, password, "", {})
          }
        }
  
        if (!autoSignIn && this.props.loggedIn == false && window.location.href.indexOf("/chat") >-1) {
          browserHistory.push("/login")
        }
      } else {
        world.onUserLogin( world.user )
      }
    }

    window.document.body.addEventListener("keydown", (e)=>this.handleKeyDown(e), true)

    let showMenuURLs = [ "chat", "login", "spaces", "files", "places", "inventory", "settings", "network", "new-world" ]
    showMenuURLs.map( (menuUrl) => {

      window.location.pathname.indexOf(`/${menuUrl}`) > -1 && this.props.toggleMenu(true)

    })

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

    window.addEventListener('vrdisplayactivate', e => {

      console.log('Display activated.', e)
      //three.vrDisplay = e.display
      //this.initiateVRMode()
      if ( true ) { //three.world.mode != "stereo") {

        navigator.getVRDisplays().then( displays => { console.log("displays", displays)
				
          if ( displays.length > 0 ) {

            console.log("vrdisplayactivate: found display: ", displays[0])
            //three.vrDisplay = displays[0]
            //this.initiateVRMode()

          }
        })
      }
    })

    let renderCanvas = document.querySelector("#viewport")

    renderCanvas.onclick = (event) => {
      let elem = event.target,
          uInput = window.three.world.userInput
      event.preventDefault()
      if (!uInput.fullscreen) {
          three.world.mode = "3d"
						elem.requestPointerLock()
            this.props.toggleMenu(false)
      }
    }
  }

  componentWillReceiveProps ( nextProps: any) {

    let newSpace = ["world", "Convolvr"],
        userNameChanged = nextProps.username != this.props.username,
        pathChange = nextProps.url.pathname.indexOf("/at") > -1 ? false : nextProps.url.pathname != this.props.url.pathname

    if ( pathChange ) {
      newSpace = detectSpaceDetailsFromURL()
      
      if ( newSpace[ 2 ] == true && !!newSpace[ 0 ] && !!newSpace[ 1 ] ) { // not navigating to built in ui / page
          if ( newSpace[ 0 ] != nextProps.worldUser || newSpace[ 1 ] != nextProps.world ) {
          
          if (newSpace[ 1 ] != nextProps.world || newSpace[ 0 ] != nextProps.worldUser ) {
            three.world.reload ( newSpace[ 0 ], newSpace[ 1 ], "", [ 0, 0, 0 ], true ) // load new world (that's been switched to via browser history)

          }
        }
      }

    } else if ( newSpace.length >= 4 ) {
      console.warn("detected world voxel coords ", newSpace[3])
      three.camera.position.set( newSpace[3][0] * GRID_SIZE[0], newSpace[3][1] * GRID_SIZE[1], newSpace[3][2] * GRID_SIZE[2] )
    }

    if ( userNameChanged ) {
      this.props.getInventory(nextProps.username, "Entities")
      this.props.getInventory(nextProps.username, "Components")
      this.props.getInventory(nextProps.username, "Properties")
    }
  }

  componentWillUpdate ( nextProps: any, nextState: any ) {


  }

  handleKeyDown (e: any) {

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
    let worldURL = detectSpaceDetailsFromURL()

    browserHistory.push(`/${worldURL[0]}/${worldURL[1]}`)
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

  initiateVRMode ( ) {

    this.props.toggleVRMode()

    let renderer = three.renderer,
        ratio = window.devicePixelRatio || 1,
        camera = three.camera,
        scene = three.scene,
        world = three.world,
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

          effect = new THREE.VREffect(renderer, world.postProcessing)
          effect.scale = 1
          effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio)
          three.vrEffect = effect
          three.vrControls = controls
          
          function onResize() {
            let ratio = window.devicePixelRatio || 1
            effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio)
          }
          function onVRDisplayPresentChange(e: any) {
            console.log('onVRDisplayPresentChange', e)
            onResize()
            
          }
          // Resize the WebGL canvas when we resize and also when we change modes.
          window.addEventListener('resize', onResize);
          window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
          console.log("vrDisplay", three.vrDisplay)
          renderer.domElement.setAttribute("class", "viewport") // clear blur effect
          if (three.vrDisplay != null) {
            three.vrDisplay.requestPresent([{source: renderer.domElement}]).then( ()=> {

              if ( world.manualLensDistance != 0 && three.vrDisplay.dpdb_) {
                setTimeout(()=>{
                  console.warn("Falling back to Convolvr lens distance settings: ", world.manualLensDistance)
                  three.vrDisplay.deviceInfo_.viewer.interLensDistance = world.manualLensDistance || 0.057 
                
                }, 0.09)
              }
              three.vrDisplay.requestAnimationFrame(()=> { // Request animation frame loop function
                vrAnimate( three.vrDisplay, Date.now(), [0,0,0], 0)
              })
            }).catch( err => {
              
              console.error( err )

            })
            
          } else {
            alert("Connect VR Display and then reload page.")
          }
         
          this.props.toggleVRMode()
          three.world.mode = three.world.mode != "stereo" ? "stereo" : "web"
          three.world.onWindowResize()
      }
  }

  renderVRButtons () {

    return this.props.stereoMode ?
        [<Button title="Exit VR"
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
                    this.initiateVRMode()
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
                     left:6,
                     bottom: 0,
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
  fetchSpaces,
  setCurrentSpace,
  fetchUniverseSettings
} from '../../redux/actions/world-actions'
import {
  getChatHistory,
  getMessage
} from '../../redux/actions/message-actions'
import { 
  fetchUsers,
  login 
} from '../../redux/actions/user-actions'
import {
  getInventory
} from '../../redux/actions/inventory-actions'

export default connect(
  state => {
    return {
      loggedIn: state.users.loggedIn,
      username: state.users.loggedIn != false ? state.users.loggedIn.name : "public",
      url: state.routing.locationBeforeTransitions,
      tools: state.tools,
      users: state.users,
      menuOpen: state.app.menuOpen,
      stereoMode: state.app.vrMode,
      focus: state.app.windowFocus,
      world: state.spaces.current,
      worldUser: state.spaces.worldUser
    }
  },
  (dispatch: any) => {
    return {
      fetchUniverseSettings: ()=> {
        dispatch(fetchUniverseSettings())
      },
      login: (user, pass, email, data) => {
            dispatch(login(user, pass, email, data))
      },
      getMessage: (message, from, files, avatar, space) => {
          dispatch(getMessage(message, from, files, avatar, space))
      },
      getInventory: (userId, category) => {
        dispatch(getInventory(userId, category))
      },
      showChat: () => {
        dispatch(showChat())
      },
      getChatHistory: (spaceName, skip) => {
        dispatch(getChatHistory(spaceName, skip))
      },
      toggleMenu: (force) => {
          //window.three.world.mode = force ? "3d" : "web"
          dispatch(toggleMenu(force))
      },
      fetchSpaces: () => {
          dispatch(fetchSpaces())
      },
      setCurrentSpace: (world) => {
        dispatch(setCurrentSpace(world))
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
