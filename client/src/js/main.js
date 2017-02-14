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
// 2d UI
import App from './2d-ui/containers/app'
import Data from './2d-ui/containers/data'
import Worlds from './2d-ui/containers/worlds'
import NewWorld from './2d-ui/containers/new-world'
import Settings from './2d-ui/containers/settings'
import Login from './2d-ui/containers/login'
import Chat from './2d-ui/containers/chat'
import HUD from './2d-ui/containers/hud'
// World
import { send, events } from './network/socket'
import { initUser } from './user'
import UserInput from './input/user-input'
import Toolbox from './world/tools/toolbox'
import World from './world/world'
// 3D UI
import HUDMenu from './vr-ui/menu'
import ListView from './vr-ui/text/list-view'
import Cursor from './vr-ui/cursor'
import Avatar from './world/avatar'
// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { indigo500, indigo600, amber800, amber500 } from 'material-ui/styles/colors'

let socket = events,
    token = localStorage.getItem("token"),
		userInput,
		user = initUser(),
	  world = null,
	  avatar = null

window.worldName = window.location.href.indexOf("/world/") > -1 ? window.location.href.split("/world/")[1] : "overworld"

userInput = new UserInput()
world = new World(userInput, socket, store)
world.load(worldName, ()=> {
  setTimeout(()=>{
    initChatUI() // wait for world & terrain to load before placing this
  }, 250)
})
user.toolbox = new Toolbox(world)
user.hud = new HUDMenu([], user.toolbox)
user.hud.initMesh({}, three.camera)
user.hud.hide()
user.cursor = new Cursor({}, user.mesh)
user.mesh.add(user.light)
world.user = user
three.scene.add(user.mesh)
userInput.init(world, world.camera, user)

userInput.rotationVector = {x: 0, y: 9.95, z: 0}
three.camera.position.set(-300000+Math.random()*150000, 55000, -300000+Math.random()*150000)
user.light.position.set(100000, 20000, 100000)

let initChatUI = () => {
  world.chat = new ListView({
    color: "#ffffff",
    background: "#000000",
    position: [0, (world.terrain.voxels["0.0.0"].data.altitude * 50000) - 22000, -5000],
    textLines: ["Welcome To Convolvr", "github.com/SpaceHexagon/convolvr"]
  }, three.scene).initMesh()
}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: indigo500,
    primary2Color: indigo600,
    accent1Color: amber800,
    accent2Color: amber500,
  },
  appBar: {
    height: 50,
  }
})

ReactDOM.render(
  (<Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
		<Router history={history}>
	  		<Route path="/" component={App} >
				<IndexRoute component={HUD}/>
        <Route path="/world/:name" component={HUD} />
				<Route path="/login" component={Login} />
				<Route path="/chat" component={Chat} />
				<Route path="/data" component={Data} />
				<Route path="/worlds" component={Worlds} />
        <Route path="/worlds/new" component={NewWorld} />
				<Route path="/settings" component={Settings} />
			</Route>
		</Router>
    </MuiThemeProvider>
  </Provider>),
  document.getElementsByTagName('main')[0]
)
