console.log('Convolvr Client Initializing')
import * as ReactDOM from 'react-dom' // React
import { Component } from 'react'
import * as React from 'react';
import { Router, Route  } from 'react-router'
import { routerReducer } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { render } from 'react-dom' // Redux
import * as redux from 'redux'
import makeStore from './redux/makeStore'
import { 
  clearOldData, 
  APP_ROOT,
  GRID_SIZE,
  GLOBAL_SPACE 
} from './config'
import Routes from './routes'
import Convolvr from './world/world'
import Systems from './systems/index'
import { events } from './network/socket'
import UserInput from './input/user-input'
import User from './world/user'
import Entity from './core/entity'
//import ProgressBar from 'progressbardottop'

let store:        Object = makeStore(routerReducer),
    socket:       Object   = events,
    token:        string   = "", 
    userInput:    UserInput,
    //progressBar:  ProgressBar,
    user:         User     = new User({}),
    loadingSpace: Convolvr = null,
    avatar:       Entity   = null, 
    toolMenu:     Entity   = null, // built in ui entities
    helpScreen:   Entity   = null, 
    chatScreen:   Entity   = null,
    httpClient:   Entity   = null

const history = createHistory()

token = localStorage.getItem("token") || ""
clearOldData()
// progressBar = new ProgressBar({
//   selector: "#progressbar",
//   hideOnComplete: true,
// })
userInput = new UserInput(null)

loadingSpace = new Convolvr( user, userInput, socket, store, (world: Convolvr) => {

  let systems:   Systems       = world.systems,
      scene:     Object        = world.three.scene,  
      pos:       any           = world.camera.position,
      coords:    Array<number> = world.getVoxel( pos ),
      voxelKey:  string        = coords.join("."),
      altitude:  number        = (systems.terrain as any).voxels[ voxelKey ].data.altitude

  world.onUserLogin = (newUser: any) => {
    console.log("on user login: ", newUser)
    avatar = systems.assets.makeEntity(  
      newUser.data.avatar || "default-avatar", 
      true, 
      { 
        userId: newUser.id, 
        userName: newUser.name,
        wholeBody: false 
      }, 
      coords 
    ) // entity id can be passed into config object
    avatar.init( scene )
    user.useAvatar( avatar )
    world.user = user
    user.toolbox = world.systems.toolbox
    
    toolMenu = systems.assets.makeEntity("tool-menu", true, {}, GLOBAL_SPACE) // method for spawning built in entities
    user.hud = toolMenu
    toolMenu.init( scene, {}, (menu: Entity) => { 
      menu.componentsByAttr.toolUI[0].state.toolUI.updatePosition()
    }); 
    
    userInput.init( world, world.camera, user )
    userInput.rotationVector = { x: 0, y: 2.5, z: 0 }
    console.info("onUserLogin", newUser, avatar)
    if ( Math.abs(coords[0]) < 2 && Math.abs(coords[2]) < 2 )
  
      pos.set( pos.x -25+Math.random()*50, pos.y + 25, pos.z -25+Math.random()*50 )
      
  }
  
  world.initChatAndLoggedInUser( localStorage.getItem("username") != null );    
  
  chatScreen = systems.assets.makeEntity( "chat-screen", true, {}, coords ); //; chatScreen.components[0].attrs.speech = {}
  chatScreen.init( scene );
  chatScreen.update( [ pos.x, altitude + 21, pos.z+10] );  
  (world as any).chat = chatScreen
  helpScreen = systems.assets.makeEntity( "help-screen", true, {}, coords );
  helpScreen.init(scene, {}, (help: Entity) => { 
    _initHTTPClientTest( world, help, coords ); 
    _initFileSystemTest( world, help, coords ); 
    _initVideoChat( world, help, coords ); 
  })
  helpScreen.update( [ pos.x-4, altitude + 21, pos.z+10 ] )
  world.help = helpScreen
  
})

//loadingSpace.progressBar = progressBar

ReactDOM.render(
  React.createElement(Routes, { store, history }),
  document.getElementsByTagName('main')[0]
)

function _initVideoChat ( world: Convolvr, helpScreen: Entity, voxel: Array<number> ) {

  let videoChat = world.systems.assets.makeEntity( "video-chat", true, {}, voxel ) // simple example of displaying GET response from server
  // videoChat.components[0].attrs.particles = {}
  videoChat.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
  videoChat.update( [ -8, 0, 0 ] )

}

function _initHTTPClientTest ( world: Convolvr, helpScreen: Entity, voxel: Array<number> ) {

  let httpClient = world.systems.assets.makeEntity( "help-screen", true, {}, voxel ), // simple example of displaying GET response from server
      compProps = httpClient.components[0].attrs

  compProps.rest = {
    get: {
      url: "/api/voxels/"+world.name+"/0x0x0,-1x0x0"
    }
  }
  compProps.text.lines = ["/api/voxels/overworld/0x0x0,-1x0x0"] // really just clearing the default text until something loads
  compProps.text.color = "#f0f0f0"
  httpClient.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
  httpClient.update( [ -12, 0, 0 ] )

}

function _initFileSystemTest ( world: Convolvr, helpScreen: Entity, voxel: Array<number> ) {

  let fileBrowser = world.systems.assets.makeEntity( "file-browser", true, {}, voxel ) // show public files in 3d
  fileBrowser.init( helpScreen.mesh ) // anchor to other entity (instead of scene) upon init
  fileBrowser.update( [ -16, 0, 0 ] )

}
