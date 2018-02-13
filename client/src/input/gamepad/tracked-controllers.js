export default class TrackedController {

  constructor(input, world) {
    this.input = input
    this.world = world
    this.buttons = {
      left: [false, false, false, false, false, false, false, false],
      right: [false, false, false, false, false, false, false, false],
    }
    this.stickCooldown = false
    this.stickTimeout = null
  }

  coolDown(hand) {
    this.stickCooldown = true
    clearTimeout(this.stickTimeout)
    this.stickTimeout = setTimeout(()=>{
      this.stickCooldown = false
    }, 50)
  }

  down( buttons, hand, index ) {
    let current = hand == 0 ? this.buttons.right : this.buttons.left,
        value = this.buttonPressed( buttons[ index ] ) && current[ index ] == false

    //current[ index ] = this.buttonValue( buttons[ index ] )
    return value
  }
    
  up( buttons, hand, index ) {
    let current = hand == 0 ? this.buttons.right : this.buttons.left,
        value = !this.buttonPressed( buttons[ index ] ) && current[ index ]

    //current[ index ] = this.buttonValue( buttons[ index ] )
    return value        
  }

  handleOculusTouch(gamepad)  {
    let axes        = gamepad.axes,
        buttons     = gamepad.buttons,
        b           = buttons.length,
        a           = axes.length,
        i           = 0,
        world       = this.world,
        input       = this.input,
        btnState = [],
        useTracking = input.trackedControls,
        rotation    = input.rotationVector,
        tools       = world.systems.toolbox
    
    if ( useTracking && gamepad.pose )    
      tools.setHandOrientation( gamepad.hand == 'left' ? 1 : 0, gamepad.pose.position, gamepad.pose.orientation )

    if ( gamepad.hand == 'left' ) {
      if ( world.settings.vrMovement == 'stick' ) {
        if ( Math.abs(axes[0]) > 0.1 )
            input.moveVector.x = axes[0] * 2

        if ( Math.abs(axes[1]) > 0.1 )
            input.moveVector.z = axes[1] * 2

      } else { // teleport mode

      }
     
      if (this.up(buttons, 1, 1 ))
        tools.usePrimary(1)

      if (this.down(buttons, 1, 2 ))
        tools.grip(1, 1)

      if (this.up(buttons, 1, 2 ))
        tools.grip( 1, -1 )

      i = 0;
      while ( i < b ) {
        btnState.push(buttonValue(buttons[ b ]))
        i += 1;
      }
      this.buttons.left = btnState;

    } else { // use right stick to use adjust tool options // right triggers for primary tool
      let dir = Math.round(gamepad.axes[0]),
          toolOptionChange = Math.round(gamepad.axes[1])

      if (dir != 0 && this.stickCooldown == false) {
        this.coolDown()
        tools.nextTool(dir)
        tools.showMenu()
      }

      if (toolOptionChange != 0 && this.stickCooldown == false) { // cycle through tool options
        this.coolDown()
        tools.useSecondary(0, toolOptionChange)
      }
 
      if ( this.up( buttons, 0, 1 ) )
        tools.usePrimary(0);

      if ( this.down( buttons, 0, 2 ) )
        tools.grip( 0, 1 );

      if ( this.up( buttons, 0, 2 ) )
        tools.grip( 0, -1 );

      btnState = this.buttons.right = []
    }

    gamepad.buttons.map(button=> {
      btnState.push( this.buttonValue(button) )
    })
  }

  handleOpenVRGamepad(gamepad)  {
        let axes        = gamepad.axes,
            buttons     = gamepad.buttons,
            b           = buttons.length,
            a           = axes.length,
            i           = 0,
            world       = this.world,
            input       = this.input,
            btnState    = [],
            useTracking = input.trackedControls,
            rotation    = input.rotationVector,
            tools       = world.systems.toolbox
      
        if (useTracking && gamepad.pose)
          tools.setHandOrientation( gamepad.hand == 'left' ? 1 : 0, gamepad.pose.position, gamepad.pose.orientation )
    
        if ( gamepad.hand == 'left' ) {
          if ( world.settings.vrMovement == 'stick' ) {
            if ( Math.abs(axes[0]) > 0.1 )
                input.moveVector.x = axes[0] * 2
    
            if ( Math.abs(axes[1]) > 0.1 )
                input.moveVector.z = -axes[1] * 2
            
          } else { // teleport mode
    
          }
         
          if ( this.up( buttons, 1, 1 ) )
            //tools.usePrimary(1)
    
          if ( this.down( buttons, 1, 2 ) )
            tools.grip(1, 1)
    
          if ( this.up( buttons, 1, 2 ) )
            tools.grip( 1, -1 )
    
          btnState = this.buttons.left = []
    
        } else { // use right stick to use adjust tool options // right triggers for primary tool
          let dir = Math.round(gamepad.axes[0]),
              toolOptionChange = Math.round(gamepad.axes[1])
    
          if (dir != 0 && this.stickCooldown == false) {
            this.coolDown()
            tools.nextTool(dir)
            tools.showMenu()
          }
    
          if (toolOptionChange != 0 && this.stickCooldown == false) { // cycle through tool options
            this.coolDown()
            tools.useSecondary(0, toolOptionChange)
          }
    
          if ( this.up( buttons, 0, 1 ) )
            //tools.usePrimary(0)
          
          if ( this.down( buttons, 0, 2 ) )
            tools.grip( 0, 1 )
          
          if ( this.up( buttons, 0, 2 ) )
            tools.grip( 0, -1 )
    
          btnState = this.buttons.right = []
        }
    
        gamepad.buttons.map(button=> {
          btnState.push( this.buttonValue(button) )
        })
      }

  handleOculusRemote(gamepad) { // oculus remote
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
        input.moveVector.x += gamepad.buttons[5].pressed * 10.1 - gamepad.buttons[4].pressed * 10.1
        input.moveVector.z += gamepad.buttons[3].pressed * 10.1 - gamepad.buttons[2].pressed * 10.1

  }

  handleDaydreamController(gamepad) {
    let button = gamepad.buttons[0]

    if ( gamepad.pose )
      tools.setHandOrientation(0, [ 0, -0.5, 0.5 ], gamepad.pose.orientation)
  
    if ( this.buttonReleased( this.buttons.right[0] ) && this.buttonPressed( button ) )
        tools.usePrimary(0) // right hand

    this.buttons.right[0] = button

  }
  
  buttonPressed(b) {
    if (typeof(b) == "object") {
      return b.pressed
    }
    return b == 1.0 || b > 0.8
  }

  buttonReleased(b) {
    if (typeof(b) == "object") {
      return !b.pressed
    }
    return b == 0.0 || b < 0.2
  }

  buttonValue(b) {
    if (typeof(b) != "boolean") {
      return b.pressed
    }
    return b
  }
}
