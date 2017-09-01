import TrackedControllers from './tracked-controllers'

export default class GamePad {
	constructor ( input ) {
    let gamepads = input.gamepads
    
		this.cooldownTimeout = null
		this.cooldown = 0
		this.bumperCooldown = 0
		this.bumperCooldownTimeout = null
    this.trackedControllers = new TrackedControllers(input, three.world)
    
    function gamepadHandler ( e, connecting ) {

      let gamepad = e.gamepad;
		      input.gamepadMode = true;

      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
                  gamepad.index, gamepad.id,
                  gamepad.buttons.length, gamepad.axes.length)
                  
      if ( connecting ) {

        gamepads[gamepad.index] = gamepad

        if ( gamepad ) {

          let id = gamepad.id

        }

      } else {

        delete gamepads[gamepad.index]

      }

    }

    window.addEventListener("gamepadconnected", function(e) { gamepadHandler( e, true ) }, false)
    window.addEventListener("gamepaddisconnected", function(e) { gamepadHandler( e, false ) }, false)

  }

  update ( input, world ) {

    let g = 0,
        id = "",
        gamepad = null,
        trackedControls = false,
        gamepads = navigator.getGamepads()

    if ( !gamepads ) {
      return
    }

    while ( g < gamepads.length ) {

      gamepad = gamepads[g]

      if ( gamepad ) {

        id = gamepad.id
        if ( id.indexOf('Oculus Touch') > -1 || id.indexOf('OpenVR Gamepad') > -1 ) { // test with vive then remove second half of this if statement

          this.trackedControllers.handleOculusTouch( gamepad )
          trackedControls = true

        } else if ( id.indexOf('OpenVR Gamepad') > -1 ) {

          this.trackedControllers.handleOpenVRGamepad(gamepad)
          trackedControls = true

        } else if ( id.indexOf('Oculus Remote') > -1 ) {

          this.trackedControllers.handleOculusRemote( gamepad )

        } else if ( id.indexOf('Daydream Controller') > -1 ) {

          this.trackedControllers.handleDaydreamController( gamepad )
          trackedControls = true

        } else if ( id.toLowerCase().indexOf('xbox') > -1 ) {

          this._handleXboxGamepad( input, world, gamepad )
          
        } else if ( id.indexOf('Gamepad') > -1 ) { 

          this._handleMobileGamepad( input, world, gamepad )

        }

        if ( trackedControls && input.trackedControls == false && world.mode == "stereo" ) {

          input.trackedControls = true
          setTimeout(()=>{ world.user.avatar.componentsByProp.hand[0].state.hand.toggleTrackedHands(true) }, 500 )

        } 

      }

      g ++

    }

  }

  _handleMobileGamepad ( input, world, gamepad ) {

    let a = gamepad.axes.length,
        buttons = gamepad.buttons,
        b = buttons.length,
        i = 0,
				rotation = input.rotationVector,
				tools = world.user.toolbox
    // implement..
    // 17 buttons
    // 4 axis

    if ( this.bumperCooldown == false ) {
        if (this.buttonPressed(buttons[0])) { // top triggers: 4 5
            tools.nextTool(-1, 0) // previous tool, right hand
        }
        if (this.buttonPressed(buttons[1])) {
          tools.nextTool(1, 0) // next tool, right hand
        }
      }

      if ( this.cooldown == false ) {
        if (this.buttonPressed(buttons[2])) { // bottom triggers: 6 7
            tools.usePrimary(0) // right hand
            this.triggerCooldown()
        }
        if (this.buttonPressed(buttons[3])) {
            tools.useSecondary(0) // right hand
            this.triggerCooldown()
        }
      }
    
     if ( gamepad.axes[0] == 0 && gamepad.axes[2] == 0 && gamepad.axes[3] == 0) { // some cheap gamepads have fake axis

      if ( Math.abs(gamepad.axes[1]) > 0.1 ) { // create settings for stick configuration
          input.moveVector.z = gamepad.axes[0] * 20000
      }

     } else {

        if (Math.abs(gamepad.axes[0]) > 0.1) {
          input.moveVector.x = gamepad.axes[0] * 20000
        }
        if (Math.abs(gamepad.axes[1]) > 0.1) {
          input.moveVector.z = gamepad.axes[1] * 20000
        }
        if (Math.abs(gamepad.axes[2]) > 0.10) { // 10 percent deadzone
          rotation.y += -gamepad.axes[2] / 20.0
        }
        if (Math.abs(gamepad.axes[3]) > 0.10) {
          rotation.x += -gamepad.axes[3] / 20.0
        }

     }
     

  }

  _handleXboxGamepad ( input, world, gamepad ) {

    let a = gamepad.axes.length,
        buttons = gamepad.buttons,
        b = buttons.length,
        i = 0,
				rotation = input.rotationVector,
				tools = world.user.toolbox

    if ( b > 8 ) {
      // face buttons: 0 1 2 3
      if ( this.bumperCooldown == false ) {
        if (this.buttonPressed(buttons[4])) { // top triggers: 4 5
            tools.nextTool(-1, 0) // previous tool, right hand
        }
        if (this.buttonPressed(buttons[5])) {
          tools.nextTool(1, 0) // next tool, right hand
        }
      }

      if ( this.cooldown == false ) {
        if (this.buttonPressed(buttons[6])) { // bottom triggers: 6 7
            tools.usePrimary(0) // right hand
            this.triggerCooldown()
        }
        if (this.buttonPressed(buttons[7])) {
            tools.useSecondary(0) // right hand
            this.triggerCooldown()
        }
      }
    }

    if ( b >= 16 ) {
      // select / start: 8 9
      // stick click(s): 10 11
      // dpad buttons: 12 13 14 15
    }

    if ( a >= 4 ) { // standard dual analogue controller

        if (Math.abs(gamepad.axes[0]) > 0.1) {
          input.moveVector.x = gamepad.axes[0] * 20000
        }
        if (Math.abs(gamepad.axes[1]) > 0.1) {
          input.moveVector.z = gamepad.axes[1] * 20000
        }
        if (Math.abs(gamepad.axes[2]) > 0.10) { // 10 percent deadzone
          rotation.y += -gamepad.axes[2] / 20.0
        }
        if (Math.abs(gamepad.axes[3]) > 0.10) {
          rotation.x += -gamepad.axes[3] / 20.0
        }

    }

  }

	triggerCooldown () {

		this.cooldown = true
		clearTimeout(this.cooldownTimeout)
		this.cooldownTimeout = setTimeout(()=>{
			this.cooldown = false
		}, 100)

	}

	bumperCoolDown () {

		this.bumperCooldown = true
		clearTimeout(this.bumperCooldownTimeout)
		this.bumperCooldownTimeout = setTimeout(()=>{
			this.bumperCooldown = false
		}, 400)

	}

  buttonPressed (b) {
    if (typeof(b) == "object") {
      return b.pressed;
    }
    return b == 1.0 || b > 0.9;
  }

}
