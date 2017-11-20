import { dispatch } from 'redux';
import { toggleMenu } from '../redux/actions/app-actions';
import { isVRMode } from '../config.js'

export default class Keyboard {

	constructor ( input, world ) {

    let keys = input.keys

    document.addEventListener("keydown", event => {
      
      let user = input.user

      if ( isVRMode( world.mode ) ) { // 0 = chat, 1 = vr

        switch ( event.keyCode ) {

          case 86: keys.q = true; break
          case 87: keys.w = true; break
          case 88: 
            if (keys.e==false) {
              user.toolbox.grip( 0, 1 )
            }
            keys.e = true
          
          break
          case 65: keys.a = true; break
          case 83: keys.s = true; break
          case 68: keys.d = true; break
          case 82: keys.r = true; break
          case 70: keys.f = true; break
          case 16: keys.shift = true; break
          case 32: keys.space = true; break
          case 27: // escape key
          // world.mode = "web"

          // if ( world.user.username != "" )
           
          //   document.body.setAttribute("class", "desktop")
          
          break;
          case 37: keys.left = true; break
          case 38: keys.up = true; break
          case 39: keys.right = true; break
          case 40: keys.down = true; break
          
        }

      }

    }, true);

    document.addEventListener( "keyup" ,  event => {

      let user = input.user

      switch ( event.keyCode ) {

        case 86: keys.q = false; break
        case 87: keys.w = false; break
        case 88:
          if (keys.e==true) {
            user.toolbox.grip( 0, -1 )
          }
          keys.e = false
        break
        case 65: keys.a = false; break
        case 83: keys.s = false; break
        case 68: keys.d = false; break
        case 82: keys.r = false; break
        case 70: keys.f = false; break
        case 16: keys.shift = false; break
        case 32: keys.space = false; break
        case 37: keys.left = false; break
        case 38: keys.up = false; break
        case 39: keys.right = false; break
        case 40: keys.down = false; break

      }

    }, true);

    document.addEventListener( "keypress" , e => {

      let tools = world.user.toolbox;

      if ( isVRMode( world.mode ) ) {

        if ( e.which >= 49 && e.which < 59 ) {
          tools.useTool( e.which - 49, 0)
          tools.useTool( e.which - 49, 1) // both hands switch.. you can manually pick up a tool in one hand, none the less
        }

        if ( e.which == 192 ) // debugging tool

          tools.useTool( 10, 0 )

      }
    }, true)
  }


  handleKeys ( input ) {

    let velocity = input.device.velocity,
        keys = input.keys,
        moveVec = input.moveVector,
        rotateVec = input.rotationVector

    if ( keys.right ) {
      rotateVec.y -= 0.05
    } else if ( keys.left ) {
      rotateVec.y += 0.05
    }

    if ( keys.up ) {
      rotateVec.x += 0.033
    } else if ( keys.down ) {
      rotateVec.x -= 0.033
    }

    if ( keys.a ) {  // maybe insert more options here...
      moveVec.x = -1
    } else if ( keys.d ) {
      moveVec.x = 1
    }

    if ( keys.w ) {
      moveVec.z = -1.3
    } else if (keys.s) {
      moveVec.z = 1.3
    }

    if ( keys.r ) {
      moveVec.y = 1
    } else if (keys.f) {
      moveVec.y = -1
    }

    // if (keys.shift) {
    //   velocity.x *= 1.02;
    //   velocity.z *= 1.02;
    // }
    if ( keys.space && !input.device.falling ) {

      input.device.falling = true;
      velocity.y = 500

    }
  }
}
