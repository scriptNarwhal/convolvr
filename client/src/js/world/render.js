export let render = (world, last) => {
  let mobile = world.mobile,
      camera = three.camera,
      cPos = camera.position,
      delta = (Date.now() - last) / 16000 ,
      time = Date.now(),
      user = world.user != null ? world.user : false

  if (!! world.userInput) {
    world.userInput.update(delta) // Update keyboard / mouse / gamepad
  }
  if (user && user.mesh && user.cursor) {
    user.cursor.deactivate()
    user.mesh.position.set(cPos.x, cPos.y, cPos.z);
    user.mesh.quaternion.set(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
    rayCast(world, camera, cursorCallback)
  }
  world.sendUserData()
  world.updateSkybox(delta)
    if (world.mode == "vr" || world.mode == "web") {
      if (world.postProcessing.enabled) {

        world.postProcessing.composer.render()

      } else {
        three.renderer.render(three.scene, camera)
      }
      world.octree.update()
    }
    last = Date.now()
    requestAnimationFrame( () => { render(world, last) } )
}

let rayCast = (world, camera, callback) => {
	let raycaster = world.raycaster,
      octreeObjects = [],
      intersections = [],
      entity = null,
      obj = null,
      i = 0
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera)
  octreeObjects = world.octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction )
  intersections = raycaster.intersectOctreeObjects( octreeObjects )
  i = intersections.length -1
  while (i > -1) {
    obj = intersections[i]
    entity = obj.object.userData.entity
    if (entity != null) {
      callback(obj, entity, world)
    }
    i --
  }
}

let cursorCallback = (obj, entity, world) => {
  let cursor = world.user.cursor
  if (cursor.entity != false) {
    cursor.entity.activated = false
    cursor.entity.gazedOver = false
  }
  if (obj.distance < 33000) {
    cursor.activate()
    cursor.setEntity(entity, obj.distance, obj.point)
    // touching / interacting range
    //console.log("Entity", obj.distance, entity)
  }
}

export let vrAnimate = (time, oldPos) => {
  let now = Date.now(),
      delta = Math.min(now - time, 500) / 16000,
      t = three,
      world = t.world,
      user = world.user,
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
    user.cursor.deactivate()
    rayCast(world, camera, cursorCallback)
    user.mesh.quaternion.fromArray(frame.pose.orientation)
    user.mesh.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    camera.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    world.updateSkybox(delta)
    world.sendUserData()
    t.vrEffect.render(t.scene, t.camera) // Render the scene.
    world.octree.update()
    t.vrDisplay.requestAnimationFrame(()=> { vrAnimate(now, vrWorldPos) }) // Keep looping.
}
