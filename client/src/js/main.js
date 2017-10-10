// @flow
console.log('Convolvr Client Initializing')
import ReactDOM from 'react-dom' // React
import React, { Component, PropTypes } from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { render } from 'react-dom' // Redux
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import makeStore from './redux/makeStore'
import { 
  clearOldData, 
  APP_ROOT,
  GRID_SIZE,
  GLOBAL_SPACE 
} from './config'
import App from './2d-ui/containers/app' // 2D UI
import Data from './2d-ui/containers/data'
import Worlds from './2d-ui/containers/worlds'
import Places from './2d-ui/containers/places'
import NewWorld from './2d-ui/containers/new-world'
import Settings from './2d-ui/containers/settings'
import ImportUI from './2d-ui/containers/import'
import Network from './2d-ui/containers/network'
import Login from './2d-ui/containers/login'
import Chat from './2d-ui/containers/chat'
import Profile from './2d-ui/containers/profile'
import HUD from './2d-ui/containers/hud'
import { THREE } from 'three' // 3D World
import Convolvr from './world/world'
import Systems from './systems/index'
import { events } from './network/socket'
import UserInput from './input/user-input'
import User from './world/user'
import Toolbox from './world/toolbox'
import Entity from './entity'

let store:        Object = makeStore(routerReducer),
    socket:       Object   = events,
    token:        string   = "", 
    userInput:    UserInput,
    user:         User     = new User(),
    loadingWorld: Convolvr = null,
    avatar:       Entity   = null, 
    toolMenu:     Entity   = null, // built in ui entities
    helpScreen:   Entity   = null, 
    chatScreen:   Entity   = null,
    httpClient:   Entity   = null

const history: Object = syncHistoryWithStore(browserHistory, store)

token = localStorage.getItem("token") || ""
clearOldData()
userInput = new UserInput()

loadingWorld = new Convolvr( user, userInput, socket, store, (world: Convolvr) => {

  let systems:   Systems       = world.systems,
      scene:     Object        = world.three.scene,  
      pos:       THREE.Vector3 = world.camera.position,
      coords:    Array<number> = world.getVoxel( pos ),
      voxelKey:  string        = coords.join("."),
      altitude:  number        = systems.terrain.voxels[ voxelKey ].data.altitude

  avatar = systems.assets.makeEntity( "default-avatar", true, { wholeBody: false }, coords ) // entity id can be passed into config object
  avatar.init( scene )
  user.useAvatar( avatar )
  world.user = user
  user.toolbox = new Toolbox( user, world )
  
  toolMenu = systems.assets.makeEntity( "tool-menu", true, {}, GLOBAL_SPACE ) // method for spawning built in entities
  user.hud = toolMenu
  toolMenu.init( scene, {}, (menu: Entity) => { 
    menu.componentsByProp.toolUI[0].state.toolUI.updatePosition()
  }) 
  
  userInput.init( world, world.camera, user )
  userInput.rotationVector = { x: 0, y: 2.5, z: 0 }

  if ( world.user == "convolvr" && world.name == "overworld" )

    pos.set( pos.x -25+Math.random()*50, pos.y + 25, pos.z -25+Math.random()*50 )
    

  chatScreen = systems.assets.makeEntity( "chat-screen", true, {}, coords ) //; chatScreen.components[0].props.speech = {}
  chatScreen.init( scene )
  chatScreen.update( [ pos.x, altitude + 21, pos.z+10] )  

  world.chat = chatScreen

  helpScreen = systems.assets.makeEntity( "help-screen", true, {}, coords )
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
      "- Swiping, dragging & gamepads move you"
    ]
  helpScreen.init(scene, {}, (help: Entity) => { 
    _initHTTPClientTest( world, help, coords ) 
    _initFileSystemTest( world, help, coords ) 
    _initVideoChat( world, help, coords ) 
  })
  helpScreen.update( [ pos.x-4, altitude + 21, pos.z+10 ] )
  world.help = helpScreen

})

ReactDOM.render(
  (<Provider store={store}>
		<Router history={history}>
	  		<Route path={APP_ROOT+"/"} component={App} >
				<IndexRoute component={HUD}/>
        <Route path={APP_ROOT+"/:userName/:worldName"} component={HUD} />
        <Route path={APP_ROOT+"/:userName/:worldName/at/:coords"} component={HUD} />
        <Route path={APP_ROOT+"/:userName/:worldName/:placeName"} component={HUD} />
        <Route path={APP_ROOT+"/login"} component={Login} />
        <Route path={APP_ROOT+"/chat"} component={Chat} />
        <Route path={APP_ROOT+"/files"} component={Data} />
        <Route path={APP_ROOT+"/files/:username"} component={Data} />
        <Route path={APP_ROOT+"/worlds"} component={Worlds} />
        <Route path={APP_ROOT+"/places"} component={Places} />
        <Route path={APP_ROOT+"/new-world"} component={NewWorld} />
        <Route path={APP_ROOT+"/settings"} component={Settings} />
        <Route path={APP_ROOT+"/import"} component={ImportUI} />
        <Route path={APP_ROOT+"/network"} component={Network} />
        <Route path={APP_ROOT+"/profile"} component={Profile} />
			</Route>
		</Router>
  </Provider>),
  document.getElementsByTagName('main')[0]
)

function _initVideoChat ( world: Convolvr, helpScreen: Entity, voxel: Array<number> ) {

  let videoChat = world.systems.assets.makeEntity( "video-chat", true, {}, voxel ) // simple example of displaying GET response from server
  // videoChat.components[0].props.particles = {}
  videoChat.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
  videoChat.update( [ -8, 0, 0 ] )

}

function _initHTTPClientTest ( world: Convolvr, helpScreen: Entity, voxel: Array<number> ) {

  let httpClient = world.systems.assets.makeEntity( "help-screen", true, {}, voxel ), // simple example of displaying GET response from server
      compProps = httpClient.components[0].props

  compProps.rest = {
    get: {
      url: "http://localhost:3007/api/chunks/"+world.name+"/0x0x0,-1x0x0"
    }
  }
  compProps.text.lines = ["localhost:3007/api/chunks/overworld/0x0x0,-1x0x0"] // really just clearing the default text until something loads
  compProps.text.color = "#f0f0f0"
  httpClient.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
  httpClient.update( [ -12, 0, 0 ] )

}

function _initFileSystemTest ( world: Convolvr, helpScreen: Entity, voxel: Array<number> ) {

  let fileBrowser = world.systems.assets.makeEntity( "file-browser", true, {}, voxel ) // show public files in 3d
  fileBrowser.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
  fileBrowser.update( [ -16, 0, 0 ] )

}
