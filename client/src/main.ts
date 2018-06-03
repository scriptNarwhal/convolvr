console.log('Convolvr Client Initializing')
import * as ReactDOM from 'react-dom' // React
import * as React from 'react';
import { routerReducer } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import makeStore from './2d-ui/redux/makeStore'
import initDemos from './demos'
import { 
  clearOldData, 
  APP_ROOT,
  GRID_SIZE,
  GLOBAL_SPACE, 
  detectSpaceDetailsFromURL
} from './config'
import Routes from './2d-ui/routes'
import Convolvr from './world/world'
import Systems from './systems/index'
import { events } from './network/socket'
import User from './world/user'
import Entity from './core/entity'

let store:        any      = makeStore(routerReducer),
    socket:       any      = events,
    token:        string   = "", 
    //progressBar:  ProgressBar,
    loadingSpace: Convolvr = null, // built in ui entities
    helpScreen:   Entity   = null, 
    chatScreen:   Entity   = null,
    httpClient:   Entity   = null

const history = createHistory();

token = localStorage.getItem("token") || ""
clearOldData();

loadingSpace = new Convolvr(socket, store, (world: Convolvr) => {
  let systems:   Systems  = world.systems,
      scene:     any      = world.three.scene,  
      pos:       any      = world.camera.position,
      coords:    number[] = world.getVoxel( pos ),
      voxelKey:  string   = coords.join("."),
      altitude:  number   = (systems.terrain as any).voxels[ voxelKey ].data.altitude;
      
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
      console.log("new user avatar", avatar);
      console.log(worldDetails);
      if (worldDetails[3] && worldDetails[3][1] <= 1) {
        console.warn("respawning camera");
        pos.y = world.systems.terrain.voxels[coords.join(".")].data.altitude+3;
      }
    }); 
  };

  world.onUserLogin(world.user);
  initDemos(world, coords, pos, altitude);

  setTimeout(()=>{
    world.initChatAndLoggedInUser( localStorage.getItem("username") != null );
  }, 400);

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
