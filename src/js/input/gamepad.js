export default class GamePad {
	constructor (input) {
    let gamepads = input.gamepads;
    function gamepadHandler (e, connecting) {
      let gamepad = e.gamepad;
		      input.gamepadMode = true;

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
        gamepads = navigator.getGamepads(),
				rotation = input.rotationVector;

    if (!gamepads) {
      return;
    }
    while (g < gamepads.length) {
      gamepad = gamepads[g];
      let i = 0,
					a = 0;

      if (gamepad) {
				a = gamepad.axes.length;
        for (i = 0; i < gamepad.buttons.length; i++) {
          let val = gamepad.buttons[i],
              pressed = this.buttonPressed(val);

        }
        for (i = 0; i < a; i++) {
          if (i == 0) {
            input.moveVector.x = gamepad.axes[0] * 16000;
          } else if (i == 1) {
            input.moveVector.z = gamepad.axes[1] * 16000;
          } else if (i == 2) {
						if (Math.abs(gamepad.axes[2]) > 0.15) { // 15 percent deadzone
							rotation.y += -gamepad.axes[2] / 30.0;
						}
          } else if (i == 3) {
						if (Math.abs(gamepad.axes[3]) > 0.15) {
            	rotation.x += -gamepad.axes[3] / 30.0;
						}
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
