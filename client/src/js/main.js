console.log('Convolvr Client Initializing')
if (localStorage.getItem("postProcessing") != null) {
  if (localStorage.getItem("version0.35") == null) {
    localStorage.setItem("version0.35", "1")
    localStorage.setItem("postProcessing", "off")
  }
}
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
// 2d UI
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
// World
import Convolvr from './world/world'
import { events } from './network/socket'
import UserInput from './input/user-input'
import Toolbox from './world/tools/toolbox'
import User from './user'
// 3D UI // deprecated.. migrating these to entity-generator / systems.assets.entities
import HUDMenu from './vr-ui/menu'
import ListView from './vr-ui/text/list-view'
import Avatar from './world/avatar'

let socket = events,
    token = localStorage.getItem("token"),
		userInput,
		user = new User(),
	  world = null,
	  avatar = null

userInput = new UserInput()
world = new Convolvr(user, userInput, socket, store)
user.useAvatar(new Avatar(user.id, false, {})) // only render hands, since this is you
user.toolbox = new Toolbox(user, world)
user.hud = new HUDMenu([], user.toolbox) 
user.hud.initMesh({}, three.camera)
user.hud.hide()
user.mesh.add(user.light)
world.user = user
three.scene.add(user.mesh)
userInput.init(world, world.camera, user)

userInput.rotationVector = {x: 0, y: 9.95, z: 0}
three.camera.position.set(-300000+Math.random()*150000, 55000, -300000+Math.random()*150000)
user.light.position.set(200000, 200000, 200000)

world.chat = new ListView({ // deprecated as of alpha 0.4.1
  color: "#ffffff",
  background: "#000000",
  position: [0,0,0],
  textLines: ["Welcome To Convolvr", "github.com/SpaceHexagon/convolvr"]
}, three.scene).initMesh()

world.help = new ListView({ // deprecated as of alpha 0.4.1
  color: "#00ff00",
  background: "#000000",
  position: [-100000,0,0],
  textLines: [
    "# Desktop users",
    "- WASD, RF, space keys: movement",
    "- Mouselook (click screen to enable)",
    "- Left/right click: primary tool / mode",
    "- Keys 1-5: switch tool",
    "- Gamepads are also supported",
    "",
    "# Desktop VR users ",
    "- Enter VR button in bottom right corner",
    "- If you have tracked controllers:",
    " * Right / Left trigger: use tool in hand",
    " * Right stick x/y axis: change tool(mode)",
    " * Left stick: movement",
    "",
    "# Mobile users (2d or with VR viewer)",
    "- Device orientation controls the camera",
    "- Swiping & dragging move you"
  ]
}, three.scene).initMesh()


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
        <Route path="/files/:username/:dir" component={Data} />
        <Route path="/files/:username/:dir/:dirTwo" component={Data} />
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
