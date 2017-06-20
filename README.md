## convolvr
WebVR game engine, server and virtual reality authoring tool.

## Overview
- Component Entity System Framework
- Multiplayer telemetry, chat, action & asset persistence provided by server
- Built in tools to build world entities from components
- Tools to visually build components from props (geometries, materials & other systems)
- Handles user input from keyboard/mouse, touch, tracked controllers
- Supports infinite, configurable, procedural worlds 
- Mesh based VR UI; Multiline text rendering

## Client Example [full code here](https://github.com/SpaceHexagon/convolvr/blob/dev/client/src/js/main.js)
```
loadingWorld = new Convolvr( user, userInput, socket, store, ( world ) => {

  let avatar = world.systems.assets.makeEntity( "default-avatar", true, { wholeBody: false } ) 
  avatar.init( three.scene )
  user.useAvatar( avatar ); world.user = user
  user.toolbox = new Toolbox( user, world )

  let toolMenu = world.systems.assets.makeEntity( "tool-menu", true ); user.hud = toolMenu
  toolMenu.init( three.scene, {}, menu => {
    menu.componentsByProp.toolUI[0].state.toolUI.updatePosition() 
  }) 

  userInput.init( world, world.camera, user )

  let chatScreen = world.systems.assets.makeEntity( "chat-screen", true )
  chatScreen.components[0].props.speech = {} // make the textbox read out loud
  chatScreen.init( three.scene )
  chatScreen.update( [ 0, 50000, 0 ] )  

})
```
## Server Examples
- [Generating Buildings](https://github.com/SpaceHexagon/convolvr/blob/dev/server/generated-buildings.go)
- [Handling User Actions](https://github.com/SpaceHexagon/convolvr/blob/dev/server/socket.go#L17)

## Installation
```
  git clone https://github.com/SpaceHexagon/convolvr.git
  cd convolvr/client
  npm install
  ./build.sh
  cd ../cmd
  go build
  ./cmd # starts server on default port 3007

```
![infinite procedural worlds](https://spacehexagon.com/app/external/Screenshot_2-crop.png)
