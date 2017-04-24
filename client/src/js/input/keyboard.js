let isVRMode = (mode) => {
  return (mode == "vr" || mode == "stereo");
}

export default class Keyboard {
	constructor (input, world) {
    let keys = input.keys;

    document.addEventListener("keydown", function (event) {
      if (isVRMode(world.mode)) { // 0 = chat, 1 = vr
        switch (event.keyCode) {
          case 87: keys.w = true; break;
          case 65: keys.a = true; break;
          case 83: keys.s = true; break;
          case 68: keys.d = true; break;
          case 82: keys.r = true; break;
          case 70: keys.f = true; break;
          case 16: keys.shift = true; break;
          case 32: keys.space = true; break;
          case 27: // escape key
          world.mode = "web"
          if (world.user.username != "") {
            //world.showChat();
            //;
            document.body.setAttribute("class", "desktop");
            //document.querySelector("#chatMode").click();
          }
          break;
        }
      }
    }, true);
    document.addEventListener("keyup", function (event) {
      switch (event.keyCode) {
        case 87: keys.w = false; break;
        case 65: keys.a = false; break;
        case 83: keys.s = false; break;
        case 68: keys.d = false; break;
        case 82: keys.r = false; break;
        case 70: keys.f = false; break;
        case 16: keys.shift = false; break;
        case 32: keys.space = false; break;
      }
    }, true);
    document.addEventListener("keypress", (e) => {
      let tools = world.user.toolbox;
      switch (e.which) {
        case 49: tools.useTool(0, 0); break; // 0: component tool *right hand only until I test with oculus touch
        case 50: tools.useTool(1, 0); break; // 0: entity tool
        case 51: tools.useTool(2, 0); break; // 0: delete tool
        case 52: tools.useTool(3, 0); break; // 0: voxel tool
        case 53: tools.useTool(4, 0); break; // 0: projectile tool
      }
    }, true)
  }


  handleKeys (input) {
    let velocity = input.device.velocity,
        keys = input.keys;

    if (keys.a) {  // maybe insert more options here...
      input.moveVector.x = -20000
    } else if (keys.d) {
      input.moveVector.x = 20000
    }
    if (keys.w) {
      input.moveVector.z = -20000
    } else if (keys.s) {
      input.moveVector.z = 22000
    }
    if (keys.r) {
      input.moveVector.y = 17000
    } else if (keys.f) {
      input.moveVector.y = -12800
    }
    // if (keys.shift) {
    //   velocity.x *= 1.02;
    //   velocity.z *= 1.02;
    // }
    if (keys.space && !input.device.falling) {
      input.device.falling = true;
      velocity.y = 1600000
    }
  }
}
