export default class GamePad {
	constructor (input) {
    let gamepads = input.gamepads;
    function gamepadHandler (e, connecting) {
      let gamepad = e.gamepad;
      input.gamepadMode = true;
      // Note:
      // gamepad === navigator.getGamepads()[gamepad.index]
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                  gamepad.index, gamepad.id,
                  gamepad.buttons.length, gamepad.axes.length);
      if (connecting) {
        gamepads[gamepad.index] = gamepad;
      } else {
        delete gamepads[gamepad.index];
      }
    }

    window.addEventListener("gamepadconnected", function(e) { gamepadHandler(e, true); }, false);
    window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler(e, false); }, false);
  }

  update (input) {
    let g = 0,
        gamepad = null,
        gamepads = navigator.getGamepads();

    if (!gamepads) {
      return;
    }
    while (g < gamepads.length) {
      gamepad = gamepads[g];
      let i = 0;
      if (gamepad) {
        for (i = 0; i < gamepad.buttons.length; i++) {
          let val = gamepad.buttons[i],
              pressed = this.buttonPressed(val);

        }
        for (i = 0; i < gamepad.axes.length; i++) {
          if (i == 0) {
            input.moveVector.x = gamepad.axes[i] * 10000;
          } else if (i == 1) {
            input.moveVector.z = gamepad.axes[i] * 10000;
          } else if (i == 2) {
            input.rotationVector.y += -gamepad.axes[i] / 50.0;
          } else if (i == 3) {
            input.rotationVector.x += -gamepad.axes[i] / 50.0;
          }
        }
      }
      g ++;
    }
  }

  buttonPressed (b) {
    if (typeof(b) == "object") {
      return b.pressed;
    }
    return b == 1.0;
  }
}
