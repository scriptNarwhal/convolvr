export default class LeapMotion {
	constructor (uInput, world) {
    Leap.loop(function (frame) {
      var mode = world.mode,
        input = uInput,
        user = world.user;
        uInput.leapMotion = true;
      if (isVRMode(mode)) { // if its VR mode and not chat mode
        if (input.leapMode == "movement") {
          frame.hands.forEach(function (hand, index) {
            var position = hand.screenPosition();
            input.moveVector.x = ((-window.innerWidth / 2) + position[0]);
            input.moveVector.z = ((-window.innerWidth / 2) + position[2]);
            input.rotationVector.y -= 0.025 * hand.yaw(); //((-window.innerWidth / 2) + position[0]) / 3000;
            input.rotationVector.x += 0.015 * hand.pitch();
          });
        } else {
          if (input.leapMode == "avatar") {
            frame.hands.forEach(function (hand, index) {
              var position = hand.screenPosition();
              if (user.hands[index] != null) {
                user.hands[index].visible = true;
                user.hands[index].rotation.set(hand.pitch(), -hand.yaw(), 0);
                user.hands[index].position.set(-50+((-window.innerWidth / 2) + position[0]), 0, -350 + position[2]);
                user.hands[index].updateMatrix();
              }
            });
          } else {
            frame.hands.forEach(function (hand, index) {
              var position = hand.screenPosition(),
              handIndex = 0;
              if (index == 0) { // if its the first hand, control the camera
                input.moveVector.x = ((-window.innerWidth / 2) + position[0]);
                input.moveVector.z = ((-window.innerWidth / 2) + position[2]);
                input.rotationVector.y -= 0.025 * hand.yaw(); //((-window.innerWidth / 2) + position[0]) / 3000;
                input.rotationVector.x += 0.015 * hand.pitch();
              } else { // if its the second hand, control the hands/hands
                while (handIndex < 2) {
                  if (user.hands[handIndex] != null) {
                    user.hands[handIndex].visible = true;
                    user.hands[handIndex].rotation.set(hand.pitch(), -hand.yaw(), 0);
                    user.hands[handIndex].position.set(-50+((300*handIndex)+((-window.innerWidth / 2) + position[0])), 0, -350 + position[2]);
                    user.hands[handIndex].updateMatrix();
                    handIndex ++;
                  }
                }
              }
            });
          }
        }
      }
      // define more leapModes here...
    }).use('screenPosition', {scale: 0.15});
  }
}
