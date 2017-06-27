console.log('Convolvr Client Initializing')
// React
import ReactDOM from 'react-dom'
import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
// Redux
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import makeStore from './redux/makeStore'
let store = makeStore(routerReducer)
const history = syncHistoryWithStore(browserHistory, store)
// 2D UI
import App from './2d-ui/containers/app'
import Data from './2d-ui/containers/data'
import Worlds from './2d-ui/containers/worlds'
import Places from './2d-ui/containers/places'
import NewWorld from './2d-ui/containers/new-world'
import Settings from './2d-ui/containers/settings'
import Network from './2d-ui/containers/network'
import Login from './2d-ui/containers/login'
import Chat from './2d-ui/containers/chat'
import HUD from './2d-ui/containers/hud'
// 3D World
import Convolvr from './world/world'
import { events } from './network/socket'
import UserInput from './input/user-input'
import User from './user'
import Toolbox from './tools/toolbox'

let socket = events,
    token = localStorage.getItem("token"),
		userInput,
		user = new User(),
	  loadingWorld = null,
	  avatar = null,
    toolMenu = null,
    helpScreen = null, // built in ui entities
    chatScreen = null,
    httpClient = null

_clearOldData()
  
userInput = new UserInput()

loadingWorld = new Convolvr( user, userInput, socket, store, ( world ) => {

  avatar = world.systems.assets.makeEntity( "default-avatar", true, { wholeBody: false } ) // entity id can be passed into config object
  avatar.init( three.scene )
  user.useAvatar( avatar )
  user.toolbox = new Toolbox( user, world )
  world.user = user

  toolMenu = world.systems.assets.makeEntity( "tool-menu", true ) // the new way of spawning built in entities
  user.hud = toolMenu
  toolMenu.init( three.scene, {}, menu => { 
    console.log("menu init ", menu)
    menu.componentsByProp.toolUI[0].state.toolUI.updatePosition()
  
  }) 
  
  userInput.init( world, world.camera, user )
  userInput.rotationVector = { x: 0, y: 4.5, z: 0 }
  three.camera.position.set( -220000+Math.random()*60000, 100000, -220000+Math.random()*60000 )

  chatScreen = world.systems.assets.makeEntity( "chat-screen", true ) //; chatScreen.components[0].props.speech = {}
  chatScreen.init( three.scene )
  chatScreen.update( [ 0, 50000, 0 ] )  
  world.chat = chatScreen

  helpScreen = world.systems.assets.makeEntity( "help-screen", true )
  helpScreen.components[0].props.text.lines = [
      "#💻 Desktop users",
      "- ⌨️ WASD, RF, space keys: movement",
      "- Mouselook (click screen)",
      "- Left click: use tool Right click: grab",
      "- Keys 0-9: switch tool",
      "- 🎮 Gamepads are supported",
      "",
      "#👓 Desktop VR users ",
      "- Enter VR button in bottom right corner",
      "- 🔦 If you have tracked controllers:",
      " * Right / Left trigger: use tool in hand",
      " * Right stick x/y axis: change tool(mode)",
      " * Left stick: movement",
      "",
      "#📱 Mobile users (2d or with VR viewer)",
      "- Device orientation controls the camera",
      "- Swiping & dragging move you"
    ]
  helpScreen.init(three.scene, {}, help => { 
    _initHTTPClientTest( world, help) 
    _initVideoChat( world, help ) 
  })
  helpScreen.update( [ -80000, 50000, 0 ] )
  world.help = helpScreen

})



ReactDOM.render(
  (<Provider store={store}>
		<Router history={history}>
	  		<Route path="/" component={App} >
				<IndexRoute component={HUD}/>
        <Route path="/:userName/:worldName" component={HUD} />
        <Route path="/:userName/:worldName/at/:coords" component={HUD} />
        <Route path="/:userName/:worldName/:placeName" component={HUD} />
				<Route path="/login" component={Login} />
				<Route path="/chat" component={Chat} />
				<Route path="/files" component={Data} />
        <Route path="/files/:username" component={Data} />
				<Route path="/worlds" component={Worlds} />
        <Route path="/places" component={Places} />
        <Route path="/new-world" component={NewWorld} />
				<Route path="/settings" component={Settings} />
        <Route path="/network" component={Network} />
			</Route>
		</Router>
  </Provider>),
  document.getElementsByTagName('main')[0]
)

function _clearOldData () {

  if (localStorage.getItem("postProcessing") != null) {

    if (localStorage.getItem("version0.35") == null) {

      localStorage.setItem("version0.35", "1")
      localStorage.setItem("postProcessing", "off")

    }

  }

}

function _initVideoChat ( world, helpScreen ) {

  let videoChat = world.systems.assets.makeEntity( "video-chat", true ) // simple example of displaying GET response from server
  // videoChat.components[0].props.particles = {}
  videoChat.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
  videoChat.update( [ -160000, 0, 0 ] )

}

function _initHTTPClientTest ( world, helpScreen ) {

  httpClient = world.systems.assets.makeEntity( "help-screen", true ) // simple example of displaying GET response from server
    let compProps = httpClient.components[0].props
    compProps.rest = {
      get: {
        url: "http://localhost:3007/api/chunks/"+world.name+"/0x0x0,-1x0x0"
      }
    }
    compProps.text.lines = ["localhost:3007/api/chunks/overworld/0x0x0,-1x0x0"] // really just clearing the default text until something loads
    compProps.text.color = "#f0f0f0"
    httpClient.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
    httpClient.update( [ -80000, 0, 0 ] )

}