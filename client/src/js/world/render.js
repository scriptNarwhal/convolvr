export let animate = ( world, last, cursorIndex ) => {

  let mobile = world.mobile,
      camera = three.camera,
      mode = world.mode,
      cPos = camera.position,
      delta = (Date.now() - last) / 0.080,
      time = Date.now(),
      user = world.user != null ? world.user : false,
      cursors = !!user && !!user.avatar ? user.avatar.componentsByProp.cursor : [],
      hands = !!user ? user.avatar.hands : false

  if (!! world.userInput) {

    world.userInput.update( delta ) // Update keyboard / mouse / gamepad

  }
  
  if (user && user.avatar && cursors) {
    
    user.avatar.update( cPos.toArray(), camera.quaternion.toArray() )
    cursorIndex = world.systems.cursor.handleCursors( cursors, cursorIndex, hands, camera, world )
    
  }

  world.sendUserData()
  world.updateSkybox( delta )
  world.systems.tick( delta, time )

  if ( mode == "3d" || mode == "web" ) {

    if (world.postProcessing.enabled) {

      world.postProcessing.composer.render()

    } else {

      three.renderer.render( three.scene, camera )

    }

    world.octree.update()

  }

  if ( mode != "stereo" && !world.IOTMode ) {

    requestAnimationFrame( () => { animate( world, time, cursorIndex ) } )

  }

}

export let vrAnimate = ( display, time, oldPos, cursorIndex ) => {

  let now = Date.now(),
      delta = Math.min(now - time, 500) / 0.080,
      t = window.three,
      world = t.world,
      camera = t.camera,
      cPos = camera.position,
      frame = world.vrFrame,
      floorHeight = world.floorHeight,
      user = world.user,
      cursors = !!user ? user.avatar.componentsByProp.cursor : false,
      cursor = !!cursors ? cursors[cursorIndex] : false,
      hands = !!user && !!user.avatar ? user.avatar.componentsByProp.hand : false,
      vrPos = [],
      vrWorldPos = []

    if ( world.HMDMode != "flymode" ) {  // room scale + gamepad movement
        
        camera.position.set(cPos.x - oldPos[0], cPos.y - oldPos[1], cPos.z -oldPos[2])
        
    } else {
        
        camera.position.set(cPos.x - oldPos[0]*0.8, cPos.y - oldPos[1]*0.8, cPos.z -oldPos[2]*0.8)
        
    }

    display.getFrameData( frame )
      

    vrPos = !!frame && !!frame.pose && !!frame.pose.position ? frame.pose.position : [ 0,0,0 ]
    vrWorldPos =  [ 1 * vrPos[0], -1 + (1 * vrPos[1]+floorHeight*6), 1 * vrPos[2] ]
    camera.quaternion.fromArray( frame.pose.orientation )
    world.userInput.update(delta)
    
    user.mesh.quaternion.fromArray( frame.pose.orientation )
    user.mesh.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    user.mesh.updateMatrix()
    camera.position.set(cPos.x + vrWorldPos[0], cPos.y + vrWorldPos[1], cPos.z + vrWorldPos[2])
    
    
    cursorIndex = world.systems.cursor.handleCursors( cursors, cursorIndex, hands, camera, world )
    world.sendUserData()
    world.updateSkybox(delta)
    world.systems.tick( delta, time )
    t.vrEffect.render(t.scene, t.camera) // Render the scene.
    world.octree.update()
    display.requestAnimationFrame(()=> { vrAnimate( display, now, vrWorldPos, cursorIndex) }) // Keep looping.

}
