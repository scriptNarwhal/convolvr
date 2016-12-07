let isVRMode = (mode) => {
  return (mode == "vr" || mode == "stereo");
}

export default class Keyboard {
	constructor (input, world) {
    let keys = input.keys,
        tools = world.user.toolbox;

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
          if (world.user.username != "") {
            //world.showChat();
            //world.mode = "desktop";
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
      switch (e.which) {
        case 49: tools.useTool("right", 0); break; // 0: component tool *right hand only until I test with oculus touch
        case 50: tools.useTool("right", 1); break; // 0: entity tool
        case 51: tools.useTool("right", 2); break; // 0: delete tool
        case 52: tools.useTool("right", 3); break; // 0: voxel tool
        case 53: tools.useTool("right", 4); break; // 0: projectile tool
      }
    }, true)
  }


  handleKeys (input) {
    let velocity = input.device.velocity,
        keys = input.keys;

    if (keys.a) {  // maybe insert more options here...
      input.moveVector.x = -12000;
    } else if (keys.d) {
      input.moveVector.x = 12000;
    }
    if (keys.w) {
      input.moveVector.z = -12000;
    } else if (keys.s) {
      input.moveVector.z = 12000;
    }
    if (keys.r) {
      input.moveVector.y = 6400;
    } else if (keys.f) {
      input.moveVector.y = -6400;
    }
    if (keys.shift) {
      velocity.x *= 1.02;
      velocity.z *= 1.02;
    }
    if (keys.space && !input.device.falling) {
      input.device.falling = true;
      velocity.y = 160000;
    }
    if (velocity.x > 999999) {
      velocity.x = 999999;
    } else if (velocity.x < -999999) {
      velocity.x = -999999;
    }
    if (velocity.y > 999999) {
      velocity.y = 999999
    } else if (velocity.y < -999999) {
      velocity.y = -999999;
    }
    if (velocity.z > 999999) {
      velocity.z = 999999
    } else if (velocity.z < -999999) {
      velocity.z = -999999;
    }
  }
}
