console.log('Convolvr Client Initializing');
// React
import ReactDOM from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
// Redux
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import makeStore from './redux/makeStore'
import App from './containers/app'
import Editor from './containers/editor'
import Memory from './containers/memory'
import Worlds from './containers/worlds'
import Settings from './containers/settings'
import Home from './containers/home'
import Login from './containers/login'
import Chat from './containers/chat'
import HUD from './containers/hud'

let store = makeStore(routerReducer);
const history = syncHistoryWithStore(browserHistory, store)

// UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import { indigo500, indigo600, amber800, amber500 } from 'material-ui/styles/colors'

// World
import UserInput from './input/user-input.js';
import World from './world/world.js';
//import Avatar from './world/avatar.js';
import io from 'socket.io-client'
let socket = io()
socket.on('connection', function(socket) {
	console.log("socket connected", socket)
	let name = window.navigator && window.navigator.platform || "New User";
	socket.emit("chat message", "Welcome "+name+"!")
});

let token = localStorage.getItem("token"),
			userInput,
			user = {
				id: Math.random(),
				name: "Human",
				gravity: 1,
				mesh:new THREE.Object3D(),
				velocity: new THREE.Vector3(0, -10, 0),
				light: new THREE.PointLight(0xffffff, 0.5, 300000),
				arms: [],
				falling: false
			},
			world,
			avatar = null;

	userInput = new UserInput();
	world = new World(userInput, socket);
	world.user = user;
	three.scene.add(user.light);
	userInput.init(world, world.camera, user);
	userInput.rotationVector = {x: 0, y: 9.95, z: 0};

	socket.on("update", data => {
		let entity = null,
			user = null,
			pos = null,
			quat = null,
			mesh = null;

		if (!! data.entity) {
			entity = data.entity;
			pos = entity.pos;
			quat = entity.quat;
			user = world.users[entity.id];
			if (user == null) {
				user = world.users[entity.id] = {
					id: entity.id,
					avatar: new Avatar()
				}
			}
			mesh = user.mesh;
		}
		if (!! mesh) {
			mesh.position.set(pos.x, pos.y, pos.z);
			mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
		}
	})

	socket.on("chat message", message => {
		console.log(message);
	})

	three.camera.position.set(100000, 20000, 100000);
	user.light.position.set(100000, 20000, 100000);

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
    });

ReactDOM.render(
  (<Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
		<Router history={history}>
	  		<Route path="/" component={App} >
				<IndexRoute component={HUD}/>
				<Route path="/login" component={Login} />
				<Route path="/home" component={Home} />
				<Route path="/chat" component={Chat} />
				<Route path="/editor" component={Editor} />
				<Route path="/memory" component={Memory} />
				<Route path="/worlds" component={Worlds} />
				<Route path="/settings" component={Settings} />
			</Route>
		</Router>
    </MuiThemeProvider>
  </Provider>),
  document.getElementsByTagName('main')[0]
)
