export let render = (world, last) => {
  let mobile = world.mobile,
      camera = three.camera,
      cPos = camera.position,
      delta = (Date.now() - last) / 16000 ,
      time = Date.now()

  if (!! world.userInput) {
    world.userInput.update(delta); // Update keyboard / mouse / gamepad
    world.raycaster.setFromCamera( world.userInput.castPos, camera );
    //rayCastArea(world, camera) // only check surrounding chunks for entities pointed at
  }
  if (world.user && world.user.mesh) {
    world.user.mesh.position.set(cPos.x, cPos.y, cPos.z);
    world.user.mesh.quaternion.set(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
  }
  world.sendUserData()
  world.updateSkybox(delta)
    if (world.mode == "vr" || world.mode == "web") {
      three.renderer.render(three.scene, camera)
      world.octree.update()
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

export let vrAnimate = (time, oldPos) => {
  let now = Date.now(),
      delta = Math.min(now - time, 500) / 16000,
      t = three,
      world = t.world,
      frame = world.vrFrame,
      camera = t.camera,
      cPos = camera.position,
      vrPos = [],
      vrWorldPos = []

    if (world.HMDMode != "flymode") {  // room scale + gamepad movement
      camera.position.set(cPos.x - oldPos[0], cPos.y - oldPos[1], cPos.z -oldPos[2])
    } else {
      camera.position.set(cPos.x - oldPos[0]*0.8, cPos.y - oldPos[1]*0.8, cPos.z -oldPos[2]*0.8)
    }
    t.vrDisplay.getFrameData(frame)
    vrPos = frame.pose.position
    vrWorldPos = [22000 * vrPos[0], 22000 * vrPos[1], 22000 * vrPos[2]]
    camera.quaternion.fromArray(frame.pose.orientation)
    world.userInput.update(delta)
    world.user.mesh.quaternion.fromArray(frame.pose.orientation)
    world.user.mesh.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    camera.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    world.updateSkybox(delta)
    world.sendUserData()
    t.vrEffect.render(t.scene, t.camera) // Render the scene.
    world.octree.update()
    t.vrDisplay.requestAnimationFrame(()=> { vrAnimate(now, vrWorldPos) }) // Keep looping.
}
