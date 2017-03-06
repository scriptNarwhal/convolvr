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
  handleOculusTouch (gamepad)  {
    let axes = gamepad.axes,
        buttons = gamepad.buttons,
        b = buttons.length,
        a = axes.length,
        i = 0,
        world = this.world,
        input = this.input,
        rotation = input.rotationVector,
        tools = world.user.toolbox,
        lastButtons = this.buttons

    //console.log("oculus touch handler ", a, b, buttons
    if (gamepad.hand == 'left') {
      if (gamepad.pose) {
        tools.setHandOrientation(1, gamepad.pose.position, gamepad.pose.orientation)
      }
      if (Math.abs(axes[0]) > 0.1) {
        input.moveVector.x = axes[0] * 16000
      }
      if (Math.abs(axes[1]) > 0.1) {
        input.moveVector.z = axes[1] * 16000
      }
      buttons.map((button, i) =>{
        if (lastButtons.left[i] == false && this.buttonPressed(button)) {
          lastButtons.left[i] = true
          switch (i) {
            case 1:
              tools.usePrimary(1) // left hand
            break
            case 2:
              tools.grip(1)
            break
          }
        }
        lastButtons.left[i] = this.buttonPressed(button)
      })
    } else { // use right stick to use adjust tool options // right triggers for primary tool
      let dir = Math.round(gamepad.axes[0]),
          toolOptionChange = Math.round(gamepad.axes[1])
      if (gamepad.pose) {
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
      buttons.map((button, i) =>{
        if (lastButtons.right[i] == false && this.buttonPressed(button)) {
          lastButtons.right[i] = true
          switch (i) {
            case 1:
              tools.usePrimary(0) // right hand
            break
            case 2:
              tools.grip(0)
            break
          }
        }
        lastButtons.right[i] = this.buttonPressed(button)
      })
    }
  }

  // oculus remote
  handleOculusRemote (gamepad) {
    let buttons = gamepad.buttons,
        b = buttons.length,
        i = 0,
        world = this.world,
        input = this.input,
        rotation = input.rotationVector,
        tools = world.user.toolbox
    //console.log("oculus remote handler ", b, buttons)
    // implement
  }

  buttonPressed (b) {
    if (typeof(b) == "object") {
      return b.pressed;
    }
    return b == 1.0 || b > 0.9;
  }
}
