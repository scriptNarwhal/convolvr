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

  update (input, world) {
    let g = 0,
				i = 0,
				a = 0,
				b = 0,
				buttons = [],
        gamepad = null,
        gamepads = navigator.getGamepads(),
				rotation = input.rotationVector,
				tools = world.user.toolbox;

    if (!gamepads) {
      return;
    }
    while (g < gamepads.length) {
      gamepad = gamepads[g];
      if (gamepad) {
				a = gamepad.axes.length;
				buttons = gamepad.buttons,
				b = buttons.length;

				if (b > 8) {
					// face buttons: 0 1 2 3
					if (this.buttonPressed(buttons[4])) { // top triggers: 4 5
						tools.nextTool(-1, 0); // previous tool, right hand
					}
					if (this.buttonPressed(buttons[5])) {
						tools.nextTool(1, 0); // next tool, right hand
					}
					if (this.buttonPressed(buttons[6])) { // bottom triggers: 6 7
						tools.usePrimary(0); // right hand
					}
					if (this.buttonPressed(buttons[7])) {
						tools.useSecondary(0); // right hand
					}

				}
				if (b >= 16) {
					// select / start: 8 9
					// stick click(s): 10 11
					// dpad buttons: 12 13 14 15
				}
				if (a >= 4) { // standard dual analogue controller
					  input.moveVector.x = gamepad.axes[0] * 30000;
						input.moveVector.z = gamepad.axes[1] * 30000;
						if (Math.abs(gamepad.axes[2]) > 0.10) { // 10 percent deadzone
							rotation.y += -gamepad.axes[2] / 20.0;
						}
						if (Math.abs(gamepad.axes[3]) > 0.10) {
            	rotation.x += -gamepad.axes[3] / 20.0;
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
    return b == 1.0 || b > 0.9;
  }
}
