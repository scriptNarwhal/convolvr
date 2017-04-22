## convolvr
WebVR game engine, server and virtual reality authoring tool.

## Overview
- Component Entity System Framework
- Multiplayer telemetry, chat, action & asset persistence provided by server
- Built in tools to build world entities from components
- Tools to visually build components from props (geometries, materials & other systems) W.I.P.
- Handles user input from keyboard/mouse, touch, tracked controllers
- Supports infinite, configurable, procedural worlds 
- Mesh based VR UI; Multiline text rendering W.I.P.

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
