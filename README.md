[![npm version](https://badge.fury.io/js/convolvr.svg)](https://badge.fury.io/js/convolvr) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
## Overview
- [Component](https://github.com/Convolvr/convolvr/blob/dev/client/src/js/component.js) [Entity](https://github.com/Convolvr/convolvr/blob/dev/client/src/js/entity.js) [System](https://github.com/Convolvr/convolvr/blob/dev/client/src/js/systems/index.js) [Framework](https://github.com/Convolvr/convolvr/wiki) built on [Three.js](https://github.com/mrdoob/three.js)
- Multiplayer telemetry, chat, action & asset persistence provided by server using [Nexus](https://github.com/ds0nt/nexus)
- Built in tools to build world entities from components
- Tools to visually build components from attrs (geometries, materials & other systems)
- Handles user input from keyboard/mouse, touch, tracked controllers
- Supports infinite, configurable, procedural spaces 
- Mesh based VR UI; Multiline text rendering

![infinite procedural spaces](client/web/images/insta.gif)

## Installation
```shell
  git clone https://github.com/convolvr/convolvr
  go get github.com/Convolvr/core
  go get github.com/Convolvr/server
  go get github.com/Convolvr/generate
  cd convolvr/client && npm install && gulp build &
  cd ../cmd && go build # && ./cmd # to start server
```

## Development 
```shell
  cd convolvr/client && gulp watch
  cd convolvr/cmd && go build # && ./cmd # to start server
```
[Wiki](https://github.com/Convolvr/convolvr/wiki/Development)

### Initialization Example 
(https://github.com/Convolvr/convolvr/blob/dev/client/src/main.ts)

### Entity / System Mapping
```js
{
  id: -4,
  name: "chat-screen",
  components: [
    {
      attrs: {
          geometry: {
              shape: "box",
              size: [ 3, 3, 0.25 ]
          },
              material: {
              color: 0x808080,
              name: "plastic"
          },
          chat: {
              userId: "all",
              displayMessages: true
          },
          text: {
              lines: [ 
                  "Welcome To Convolvr", 
              ],
              color: "#ffffff",
              background: "#000000"
          }
      },
      quaternion: [ 0, 0, 0, 1 ],
      position: [ 0, 0, 0 ]
    }
  ]
}
```
## Server Examples
- [Generating Buildings](https://github.com/Convolvr/generate/blob/dev/building.go)
- [Handling User Actions](https://github.com/convolvr/server/blob/dev/socket.go#L17)
