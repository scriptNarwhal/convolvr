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
    loadingSpace: Convolvr = null,
    toolMenu:     Entity   = null, // built in ui entities
    helpScreen:   Entity   = null, 
    chatScreen:   Entity   = null,
    httpClient:   Entity   = null

const history = createHistory();

token = localStorage.getItem("token") || ""
clearOldData();
console.warn("test");
loadingSpace = new Convolvr(socket, store, (world: Convolvr) => {
  let systems:   Systems  = world.systems,
      scene:     any      = world.three.scene,  
      pos:       any      = world.camera.position,
      coords:    number[] = world.getVoxel( pos ),
      voxelKey:  string   = coords.join("."),
      altitude:  number   = (systems.terrain as any).voxels[ voxelKey ].data.altitude,
      convolvr = world;
      
  world.onUserLogin = (newUser: any) => {
    let user = world.user;
    
    user.data = {
      ...user.data,
      ...newUser
    };
    user.name = newUser.userName;
    user.id = newUser.id;
    world.initUserAvatar(coords, newUser, ()=> {
      console.log("new user", newUser)
      world.initUserInput();
      user.toolbox = world.systems.toolbox
      toolMenu = systems.assets.makeEntity("tool-menu", true, {}, GLOBAL_SPACE) // method for spawning built in entities
      user.hud = toolMenu
      toolMenu.init( scene, {}, (menu: Entity) => { 
        menu.componentsByAttr.toolUI[0].state.toolUI.updatePosition()
      }); 
    }); 
     
  };
  console.warn("about to call onUserLogin");
  world.onUserLogin(world.user);
  console.warn("test 222");
  initDemos(world, coords, pos, altitude);
  console.warn("test 2222");

  setTimeout(()=>{
    world.initChatAndLoggedInUser( localStorage.getItem("username") != null );
  }, 400);

});


setTimeout( ()=> { 
  let respawnCamera = () => {

    let cameraPos = loadingSpace.three.camera.position,
        voxelKey = `${Math.floor(cameraPos.x / GRID_SIZE[ 0 ])}.0.${Math.floor(cameraPos.z / GRID_SIZE[ 2 ])}`,
        altitude = 0;
    
    if (worldDetails[2] && worldDetails[2][1] < 0) {
      cameraPos.y+= 50;
    }
    loadingSpace.user.velocity.y = -1000
  };
  let worldDetails = detectSpaceDetailsFromURL();
  loadingSpace.load( worldDetails[ 0 ], worldDetails[ 1 ], () => { /* systems online */ }, ()=> { /* terrain finished loading */
    respawnCamera()
  });
}, 100);

ReactDOM.render(
  React.createElement(Routes, { store, history }),
  document.getElementsByTagName('main')[0]
)
