let tmpVector = new THREE.Vector3( 0, 0, 1 ),
    tmpVector2 = new THREE.Vector2(0, 0)

let rayCast = (world, camera, cursor, handMesh, callback) => {
	let raycaster = world.raycaster,
      octreeObjects = [],
      intersections = [],
      entity = null,
      obj = null,
      i = 0

  if (handMesh != null) {
    tmpVector.applyQuaternion(handMesh.quaternion)
    raycaster.set(handMesh.position, tmpVector)
  } else {
    raycaster.setFromCamera(tmpVector2, camera)
  }
  

  octreeObjects = world.octree.search(raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction)
  intersections = raycaster.intersectOctreeObjects(octreeObjects)
  i = intersections.length -1
  while (i > -1) {
    obj = intersections[i]
    entity = obj.object.userData.entity
    callback(obj, entity, cursor, handMesh, world)
    i --
  }
}

let cursorCallback = (obj, entity, cursor, hand, world) => {
  let cb = 0,
      callbacks = []
  cursor.state.cursor = {
    distance: obj.distance,
    mesh: obj.object,
    entity
  }
  if (!!entity) {
    callbacks = entity.hoverCallbacks
    cb = callbacks.length
    while (cb >= 0) {
     callbacks[cb]()
     cb --
    }
    callbacks = entity.activationCallbacks // check if cursor / hand is activated
    cb = callbacks.length
    while (cb >= 0) {
      callbacks[cb]()
      cb --
    }
  }
}

let handleCursors = (cursors, cursorIndex, hands, camera, world) => {
  let handMesh = null
  cursors.map((cursor, i) => { // animate cursors & raycast scene
      let state = cursor.state.cursor,
          cursorMesh = cursor.mesh,
          cursorPos = cursorMesh.position

      if (!!state) {
        if (state.distance > cursorPos.z) {
          cursorPos.z += 1000
        } else if (state.distance < cursorPos.z) {
          cursorPos.z -= 1000
        }
      }
      cursorMesh.updateMatrix()
      
      if (i == cursorIndex) {
        if (i > 0) {
          handMesh = cursors[i].mesh.parent
          !!handMesh && handMesh.updateMatrix()
        }
        rayCast(world, camera, cursor, handMesh, cursorCallback)
      }
  })
  cursorIndex ++
  if (cursorIndex == cursors.length) {
      cursorIndex = 0
  }
  return cursorIndex
}

export let render = (world, last, cursorIndex) => {
  let mobile = world.mobile,
      camera = three.camera,
      cPos = camera.position,
      delta = (Date.now() - last) / 16000 ,
      time = Date.now(),
      user = world.user != null ? world.user : false,
      cursors = !!user ? user.avatar.cursors : [],
      hands = !!user ? user.avatar.hands : false

  if (!! world.userInput) {
    world.userInput.update(delta) // Update keyboard / mouse / gamepad
  }
  if (user && user.mesh && cursors) {
    user.mesh.position.set(cPos.x, cPos.y, cPos.z);
    user.mesh.quaternion.set(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
    cursorIndex = handleCursors(cursors, cursorIndex, hands, camera, world)
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
    if (world.mode != "stereo") {
      requestAnimationFrame( () => { render(world, last, cursorIndex) } )
    }
}

export let vrAnimate = (time, oldPos, cursorIndex) => {
  let now = Date.now(),
      delta = Math.min(now - time, 500) / 16000,
      t = three,
      world = t.world,
      user = world.user,
      frame = world.vrFrame,
      camera = t.camera,
      cPos = camera.position,
      vrPos = [],
      vrWorldPos = [],
      cursors = !!user ? user.avatar.cursors : false,
      cursor = !!cursors ? cursors[cursorIndex] : false,
      hands = !!user ? user.avatar.hands : false

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

    cursorIndex = handleCursors(cursors, cursorIndex, hands, camera, world)
    user.mesh.quaternion.fromArray(frame.pose.orientation)
    user.mesh.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    camera.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    world.updateSkybox(delta)
    world.sendUserData()
    t.vrEffect.render(t.scene, t.camera) // Render the scene.
    world.octree.update()
    t.vrDisplay.requestAnimationFrame(()=> { vrAnimate(now, vrWorldPos, cursorIndex) }) // Keep looping.
}
