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
import Channels from './containers/channels'
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
import io from 'socket.io-client'

//import SocketEvents from './socket-events.js';
//import WorldPhysics from './world/world-physics.js';
import World from './world/world.js';
//import Avatar from './world/avatar.js';

var token = localStorage.getItem("token"),
			userInput,
			world,
			avatar = null;

	userInput = new UserInput();
	world = new World(userInput);
	userInput.init(world, world.camera, {gravity: 1, mesh:new THREE.Object3D(), velocity: new THREE.Vector3()});
	userInput.rotationVector = {x: 0, y: 9.95, z: 0};
	three.camera.position.set(100000, 20000, 100000);

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
				<Route path="/channels" component={Channels} />
				<Route path="/settings" component={Settings} />
			</Route>
		</Router>
    </MuiThemeProvider>
  </Provider>),
  document.getElementsByTagName('main')[0]
)
