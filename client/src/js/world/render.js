import { send } from '../network/socket'

export let render = (world, last) => {
  var core = three.core,
      mobile = world.mobile,
      camera = three.camera,
      cPos = camera.position,
      delta = (Date.now() - last) / 16000 ,
      time = Date.now(),
      image = "",
      imageSize = [0, 0],
      beforeHMD = [0, 0, 0],
      userArms = world.user.arms,
      arms = [];

  if (!! world.userInput) {
    if (world.mode != "stereo") {
      world.userInput.update(delta); // Update keyboard / mouse / gamepad
    }
    world.raycaster.setFromCamera( world.userInput.castPos, camera );
    //rayCastArea(world, camera) // only check surrounding chunks for entities pointed at
  }
  if (world.user && world.user.mesh) {
    world.user.mesh.position.set(cPos.x, cPos.y, cPos.z);
    world.user.mesh.quaternion.set(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
  }
  if (world.sendUpdatePacket == 12) { // send image
    world.sendVideoFrame()
  }
  world.sendUpdatePacket += 1
  if (world.sendUpdatePacket %((2+(1*world.mode == "stereo"))*(mobile ? 2 : 1)) == 0) {
    if (world.userInput.leapMotion) {
      userArms.forEach(function (arm) {
        arms.push({pos: [arm.position.x, arm.position.y, arm.position.z],
          quat: [arm.quaternion.x, arm.quaternion.y, arm.quaternion.z, arm.quaternion.w] });
        });
      }
      send('update', {
        entity: {
          id: world.user.id,
          username: world.user.username,
          image: world.webcamImage,
          imageSize: imageSize,
          arms: arms,
          position: {x:camera.position.x, y:camera.position.y, z: camera.position.z},
          quaternion: {x: camera.quaternion.x, y: camera.quaternion.y, z: camera.quaternion.z, w:camera.quaternion.w}
        }
      });
      if (world.capturing) {
          world.webcamImage = ""
      }
    }
    world.skybox && world.skybox.material && ()=>{world.skybox.material.uniforms.time.value += delta }
    world.skybox && world.skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
    world.skybox && world.ground.position.set(camera.position.x, camera.position.y - 2000, camera.position.z);
    if (world.mode == "vr" || world.mode == "web") {
      if (world.screenResX > 1900 || three.renderer == null) {
        three.rendererAA.render(three.scene, camera)
      } else {
        three.renderer.render(three.scene, camera)
      }
    }
    last = Date.now()
    requestAnimationFrame( () => { render(world, last) } )
  }

let rayCast = (objects, world, camera) => {
	let i = 0,
      o = null,
      intersects = world.raycaster.intersectObjects( objects || three.scene.children )
	for ( i = 0; i < intersects.length; i++ ) {
    o = intersects[ i ].object
    console.log(o.userData)
	}
}

let rayCastArea = (world, camera) => {
  let coords = three.world.terrain.chunkCoords,
      chunks = three.world.terrain.pMap,
      chunk = null,
      x = -1,
      z = -1
   while (x < 2) {
     while (z < 2) {
       chunk = chunks[`${coords[0]+x}.0.${coords[2]+z}`]
       if (chunk && chunk.mesh) {
         rayCast(chunk.mesh.children, world, camera)
       }
       z ++
     }
     x++
   }

}

export let vrAnimate = (time, oldPos) => {
  let now = Date.now(),
      delta = Math.min(now - time, 500) / 16000,
      frame = new VRFrameData(),
      t = three,
      world = t.world,
      camera = t.camera,
      cPos = camera.position,
      vrPos = [],
      vrWorldPos = []

      if (world.HMDMode != "flymode") {  // otherwise room scale + gamepad movement
        camera.position.set(cPos.x - oldPos[0], cPos.y - oldPos[1], cPos.z -oldPos[2])
      }
      world.userInput.update(delta)
      t.vrDisplay.getFrameData(frame)
      vrPos = frame.pose.position
      vrWorldPos = [20000 * vrPos[0], 20000 * vrPos[1], 20000 * vrPos[2]]
      camera.quaternion.fromArray(frame.pose.orientation)
      world.user.mesh.quaternion.fromArray(frame.pose.orientation)
      world.user.mesh.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
      camera.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])

  t.vrEffect.render(t.scene, t.camera) // Render the scene.
  t.vrDisplay.requestAnimationFrame(()=> { vrAnimate(now, vrWorldPos) }) // Keep looping.
}
