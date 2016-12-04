export default class GamePad {
	constructor (input) {
    let gamepads = input.gamepads;

    function gamepadHandler(e, connecting) {
      let gamepad = e.gamepad;
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

    }

    buttonPressed (b) {
      if (typeof(b) == "object") {
        return b.pressed;
      }
      return b == 1.0;
    }

  }
}
