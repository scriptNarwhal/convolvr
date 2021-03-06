console.log('Convolvr Client Initializing')
import * as ReactDOM from 'react-dom' // React
import * as React from 'react';
import { routerReducer } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import makeStore from './2d-ui/redux/makeStore'
import initDemos from './demos'
import { 
  clearOldData, 
  GLOBAL_SPACE, 
  detectSpaceDetailsFromURL
} from './config'
import Routes from './2d-ui/routes'
import Convolvr from './world/world'
import Systems from './systems/index'
import { events } from './network/socket'
import User from './world/user'
import Entity from './model/entity'

let store:        any      = makeStore(routerReducer),
    socket:       any      = events,
    token:        string   = "", 
    //progressBar:  ProgressBar,
    loadingSpace: Convolvr = null;

const history = createHistory();

token = localStorage.getItem("token") || ""
clearOldData();

loadingSpace = new Convolvr(socket, store, (world: Convolvr) => {
  let systems:   Systems  = world.systems,
      pos:       any      = world.camera.position,
      coords:    number[] = world.getVoxel( pos ),
      voxelKey:  string   = coords.join("."),
      altitude:  number   = systems.space.voxels[ voxelKey ].data.altitude;
      
  world.onUserLogin = (newUser: any) => {
    let user = world.user;
    let worldDetails = detectSpaceDetailsFromURL();
    
    user.data = {
      ...user.data,
      ...newUser
    };
    user.name = newUser.userName;
    user.id = newUser.id;
    world.initUserAvatar(newUser, (avatar: Entity)=> {
      if (worldDetails[3] && worldDetails[3][1] <= 1) {
        console.warn("respawning camera");
        pos.y = world.systems.space.voxels[coords.join(".")].data.altitude+3;
      }
    }); 
  };

  world.onUserLogin(world.user);
  initDemos(world, GLOBAL_SPACE, pos, altitude);

  setTimeout(()=>{
    world.initChatAndLoggedInUser( localStorage.getItem("username") != null );
  }, 400);

  const dummy = world.systems.assets.makeEntity("tool-menu", true, {}, [0,1,1]) as Entity;

  dummy.init(world.three.scene);
  dummy.update([0,40,0]);
});

setTimeout( ()=> { 
  let worldDetails = detectSpaceDetailsFromURL();

  loadingSpace.load( worldDetails[ 0 ], worldDetails[ 1 ], () => { /* systems online */ }, ()=> { /* terrain finished loading */

  });
}, 500);

ReactDOM.render(
  React.createElement(Routes, { store, history }),
  document.getElementsByTagName('main')[0]
)
