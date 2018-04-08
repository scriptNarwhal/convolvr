import UserInput from "./user-input";
import Convolvr from "../world/world";

export default class LeapMotion {

	constructor (uInput: UserInput, world: Convolvr) {

    (window as any).Leap.loop(function (frame: any) {

      let mode = world.mode,
          input = uInput,
          user = world.user,
          toolbox = user.toolbox

        uInput.leapMotion = true

      if ( true ) { //isVRMode(mode)) { // if its VR mode and not chat mode
        if ( input.leapMode == "movement" ) {
          frame.hands.forEach(( hand: any, index: number ) => {
            let position = hand.screenPosition()

            input.moveVector.x = (((-window.innerWidth / 2) + position[0])) * 30
            input.moveVector.z = (((-window.innerWidth / 2) + position[2])) * 30
            input.rotationVector.y -= 0.025 * hand.yaw() //((-window.innerWidth / 2) + position[0]) / 0.08;
            input.rotationVector.x += 0.015 * hand.pitch()
          })

        } else {

          if ( input.leapMode == "avatar" ) {

            frame.hands.forEach( ( hand: any, index: number ) => {
              let position = hand.screenPosition(),
                  handMesh = null

              if ( toolbox.hands[ index ] != null ) {
                handMesh = toolbox.hands[ index ].mesh
                handMesh.visible = true
                handMesh.rotation.set( hand.pitch(), -hand.yaw(), 0 )
                handMesh.position.set( -0.333+(((-window.innerWidth / 2) )+ position[0]* 10), 0, -0.222 - position[2]* 10 )
                handMesh.updateMatrix()
                // refactor this..
                // include logic for moving by grabbing..
                // possibly modify this to work with teleporting 
              }
            })
          } else {
            frame.hands.forEach( ( hand: any, index: number ) => {
              let position = hand.screenPosition(),
                  handIndex = 0,
                  handMesh = null

              if ( index == 0 ) { // if its the first hand, control the camera
                input.moveVector.x = (((-window.innerWidth / 2) + position[0])) * 30
                input.moveVector.z = (((-window.innerWidth / 2) + position[2])) * 30
                input.rotationVector.y -= 0.025 * hand.yaw() //((-window.innerWidth / 2) + position[0]) / 0.08;
                input.rotationVector.x += 0.015 * hand.pitch()
              } else { // if its the second hand, control the hands/hands
                while ( handIndex < 2 ) {
                  if ( toolbox.hands[ handIndex ] != null ) {
                    handMesh = toolbox.hands[ handIndex ].mesh
                    handMesh.visible = true
                    handMesh.rotation.set( hand.pitch(), -hand.yaw(), 0 )
                    handMesh.position.set( -0.333+((0.5*handIndex)+((-window.innerWidth / 20000) + position[0]) * 10), -0.1, -0.05 + position[2] * 10 )
                    handMesh.updateMatrix()
                    handIndex ++
                  }
                }
              }
            })
          }
        }
      }
      // define more leapModes here...
    }).use('screenPosition', {scale: 0.15});
  }
}
