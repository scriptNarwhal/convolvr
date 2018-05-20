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
  GLOBAL_SPACE 
} from './config'
import Routes from './2d-ui/routes'
import Convolvr from './world/world'
import Systems from './systems/index'
import { events } from './network/socket'
import User from './world/user'
import Entity from './core/entity'
//import ProgressBar from 'progressbardottop'

let store:        any      = makeStore(routerReducer),
    socket:       any      = events,
    token:        string   = "", 
    //progressBar:  ProgressBar,
    loadingSpace: Convolvr = null,
    toolMenu:     Entity   = null, // built in ui entities
    helpScreen:   Entity   = null, 
    chatScreen:   Entity   = null,
    httpClient:   Entity   = null

const history = createHistory()

token = localStorage.getItem("token") || ""
clearOldData()

loadingSpace = new Convolvr(socket, store, (world: Convolvr) => {
  let systems:   Systems  = world.systems,
      scene:     any      = world.three.scene,  
      pos:       any      = world.camera.position,
      coords:    number[] = world.getVoxel( pos ),
      voxelKey:  string   = coords.join("."),
      altitude:  number   = (systems.terrain as any).voxels[ voxelKey ].data.altitude;
     
  world.onUserLogin = (newUser: any) => {
    let user = world.user;
    
    user.data = {
      ...user.data,
      ...newUser
    };
    user.name = newUser.userName;
    user.id = newUser.id;
    world.initUserAvatar(coords, newUser, ()=> {

      world.initUserInput();
      user.toolbox = world.systems.toolbox
      toolMenu = systems.assets.makeEntity("tool-menu", true, {}, GLOBAL_SPACE) // method for spawning built in entities
      user.hud = toolMenu
      toolMenu.init( scene, {}, (menu: Entity) => { 
        menu.componentsByAttr.toolUI[0].state.toolUI.updatePosition()
      }); 
    }); 
  };
  world.onUserLogin(world.user);

  
  initDemos(world, coords, pos, altitude);
  setTimeout(()=>world.initChatAndLoggedInUser( localStorage.getItem("username") != null ), 1400);    
 
});

ReactDOM.render(
  React.createElement(Routes, { store, history }),
  document.getElementsByTagName('main')[0]
)
