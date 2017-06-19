let isVRMode = ( mode ) => {
  return (mode == "3d" || mode == "stereo")
}

export default class Keyboard {

	constructor ( input, world ) {

    let keys = input.keys

    document.addEventListener("keydown", ( event ) => {

      if ( isVRMode( world.mode ) ) { // 0 = chat, 1 = vr

        switch ( event.keyCode ) {

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
           
            document.body.setAttribute("class", "desktop")
           
          }

          break;

        }

      }

    }, true);

    document.addEventListener( "keyup" , function (event) {

      switch ( event.keyCode ) {

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

    document.addEventListener( "keypress" , (e) => {

      let tools = world.user.toolbox;

      if ( e.which >= 49 && e.which < 59 ) {

        tools.useTool( e.which - 49, 0)
        tools.useTool( e.which - 49, 1) // both hands switch.. you can manually pick up a tool in one hand, none the less

      }

      if ( e.which == 192 ) { // debugging tool

        tools.useTool( 10, 0 )

      }

    }, true)

  }


  handleKeys ( input ) {

    let velocity = input.device.velocity,
        keys = input.keys;

    if ( keys.a ) {  // maybe insert more options here...

      input.moveVector.x = -20000

    } else if ( keys.d ) {

      input.moveVector.x = 20000

    }

    if ( keys.w ) {

      input.moveVector.z = -20000

    } else if (keys.s) {

      input.moveVector.z = 22000

    }

    if ( keys.r ) {

      input.moveVector.y = 17000

    } else if (keys.f) {

      input.moveVector.y = -12800

    }
    // if (keys.shift) {
    //   velocity.x *= 1.02;
    //   velocity.z *= 1.02;
    // }
    if ( keys.space && !input.device.falling ) {

      input.device.falling = true;
      velocity.y = 2400000

    }

  }
  
}
