export default class TrackedController {

  constructor (input, world) {

    this.input = input
    this.world = world
    this.buttons = {
      left: [false, false, false, false, false, false],
      right: [false, false, false, false, false, false],
    }
    this.stickCooldown = false
    this.stickTimeout = null

  }

  coolDown (hand) {

    this.stickCooldown = true
    clearTimeout(this.stickTimeout)
    this.stickTimeout = setTimeout(()=>{
      this.stickCooldown = false
    }, 250)

  }

  handleOpenVRGamepad ( gamepad ) {

    // implement

  }

  handleOculusTouch (gamepad)  {

    let axes = gamepad.axes,
        buttons = gamepad.buttons,
        b = buttons.length,
        a = axes.length,
        i = 0,
        world = this.world,
        input = this.input,
        useTracking = input.trackedControls,
        rotation = input.rotationVector,
        tools = world.user.toolbox,
        lastButtons = this.buttons

    //console.log("oculus touch handler ", a, b, buttons
    if ( gamepad.hand == 'left' ) {

      if (useTracking && gamepad.pose) {

        tools.setHandOrientation(1, gamepad.pose.position, gamepad.pose.orientation)

      }

      if ( world.vrMovement == 'stick' ) {

        if (Math.abs(axes[0]) > 0.1) {

            input.moveVector.x = axes[0] * 32000

        }

        if (Math.abs(axes[1]) > 0.1) {

            input.moveVector.z = axes[1] * 32000

        }
      } else { // teleport mode

      }
     
      buttons.map( ( button, i ) => {

        if (lastButtons.left[i] == false && this.buttonPressed(button)) {

          lastButtons.left[i] = true

          switch (i) {
            case 1:
              tools.usePrimary(1) // left hand
            break
            case 2:
              tools.grip(1, this.buttonValue(button))
            break
            // find out index for stick click
          }

        } else if (lastButtons.left[i] == true && this.buttonReleased(button)) {

          if (i == 2) {

            tools.grip(1, -1)

          } 

        }

        lastButtons.left[i] = this.buttonPressed(button)

      })

    } else { // use right stick to use adjust tool options // right triggers for primary tool

      let dir = Math.round(gamepad.axes[0]),
          toolOptionChange = Math.round(gamepad.axes[1])

      if (useTracking && gamepad.pose) {

        tools.setHandOrientation(0, gamepad.pose.position, gamepad.pose.orientation)

      }

      if (dir != 0 && this.stickCooldown == false) {
        this.coolDown()
        tools.nextTool(dir)
        tools.showMenu()
      }

      if (toolOptionChange != 0 && this.stickCooldown == false) { // cycle through tool options
        this.coolDown()
        tools.useSecondary(0, toolOptionChange)
      }

      buttons.map( ( button, i ) => {

        if (lastButtons.right[i] == false && this.buttonPressed(button)) {

          lastButtons.right[i] = true

          switch ( i ) {
            case 1:
              tools.usePrimary(0) // right hand
            break
            case 2:
              tools.grip(0, this.buttonValue(button))
            break
            // find out index for stick click
          }

        } else if ( lastButtons.right[i] == true && this.buttonReleased(button) ) {

          if ( i == 2 ) {

            tools.grip(0, -1)

          }

        }

        lastButtons.right[i] = this.buttonPressed(button)

      })

    }

  }

  handleOculusRemote ( gamepad ) { // oculus remote

    let buttons = gamepad.buttons,
        b = buttons.length,
        i = 0,
        world = this.world,
        input = this.input,
        rotation = input.rotationVector,
        tools = world.user.toolbox,
        button = gamepad.buttons[0]

        if ( this.buttonReleased( this.buttons.right[0] ) && this.buttonPressed( button ) )

          tools.usePrimary(0) // right hand

        this.buttons.right[0] = button
        input.moveVector.x += gamepad.buttons[5].pressed * 12500 - gamepad.buttons[4].pressed * 12500
        input.moveVector.z += gamepad.buttons[3].pressed * 12500 - gamepad.buttons[2].pressed * 12500

  }

  

  handleDaydreamController ( gamepad ) {

    let button = gamepad.buttons[0]

    if ( gamepad.pose )

      tools.setHandOrientation(0, [ 0, -5000, 5000 ], gamepad.pose.orientation)
  
    if ( this.buttonReleased( this.buttons.right[0] ) && this.buttonPressed( button ) )

        tools.usePrimary(0) // right hand

    this.buttons.right[0] = button

  }

  
  

  buttonPressed (b) {

    if (typeof(b) == "object") {
      return b.pressed
    }
    return b == 1.0 || b > 0.8

  }

  buttonReleased (b) {

    if (typeof(b) == "object") {
      return !b.pressed
    }
    return b == 0.0 || b < 0.2

  }

  buttonValue (b) {

    if (typeof(b) == "object") {
      return b.pressed
    }
    return b
    
  }

}
