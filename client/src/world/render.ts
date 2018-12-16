import Convolvr from "./world";

export let animate = (world: Convolvr, last: number, cursorIndex: number) => {
  let three = world.three,
      mode = world.mode,
      willRender = world.willRender,
      mirrorOutput = world.settings.mirrorOutput && world.mode == "stereo";
      
    let camera = three.camera,
        cPos = camera.position,
        delta = (Date.now() - last) / 0.080,
        time = Date.now(),
        user: any = world.user != null ? world.user : false,
        cursors = !!user && !!user.avatar ? user.avatar.componentsByAttr.cursor : [],
        hands = !!user ? user.avatar.hands : false;

      if (mode != "stereo") {     
        if (!! world.userInput) {
          world.userInput.update( delta ) // Update keyboard / mouse / gamepad
        }
    
        if (user && user.avatar && cursors) {
          user.avatar.update( cPos.toArray(), camera.quaternion.toArray(), false, false, false, { updateWorkers: false } )
          cursorIndex = world.systems.cursor.handleCursors( cursors, cursorIndex, hands, camera, world )
        }
      
        world.sendUserData()
        world.systems.tick( delta, time );

        if (willRender) {
          if (world.postProcessing.enabled) {
            world.postProcessing.composer.render();
          } else {
              three.renderer.render( three.scene, camera );
          }
        }
        
        requestAnimationFrame( () => { animate( world, time, cursorIndex ) } );
      } else if (mirrorOutput) {

        if (world.postProcessing.enabled) {
          world.postProcessing.composer.render();
        } else {
            three.renderer.render( three.scene, camera );
        }
        
        requestAnimationFrame( () => { animate( world, time, cursorIndex ) } );
      }
      // world.octree.update()
}

export let vrAnimate = (world: Convolvr, display: VRDisplay, time: number, oldPos: number[], cursorIndex: number) => {

  let now = Date.now(),
      delta = Math.min(now - time, 500) / 0.080,
      t = world.three,
      camera = t.camera,
      cPos = camera.position,
      frame = world.vrFrame,
      floorHeight = world.settings.floorHeight,
      user = world.user,
      cursors = !!user ? user.avatar.componentsByAttr.cursor : false,
      // cursor = !!cursors ? cursors[cursorIndex] : false,
      hands = !!user && !!user.avatar ? user.avatar.componentsByAttr.hand : false,
      vrPos = [],
      vrSpacePos = [0,0,0];

    camera.matrixAutoUpdate = false;
    if ( world.HMDMode != "flymode" ) {  // room scale + gamepad movement
        camera.position.set(cPos.x - oldPos[0], cPos.y - oldPos[1], cPos.z -oldPos[2]);
    } else {
        camera.position.set(cPos.x - oldPos[0]*0.8, cPos.y - oldPos[1]*0.8, cPos.z -oldPos[2]*0.8);  
    }

    display.getFrameData( frame );
      
    vrPos = !!frame && !!frame.pose && !!frame.pose.position ? frame.pose.position : [ 0,0,0 ]
    vrSpacePos =  [ vrPos[0], (vrPos[1]+floorHeight), vrPos[2] ]
    camera.quaternion.fromArray( frame.pose.orientation )
    world.userInput.update(delta)
    user.mesh.quaternion.fromArray( frame.pose.orientation )
    user.mesh.position.set(cPos.x + vrSpacePos[0], cPos.y + vrSpacePos[1], cPos.z + vrSpacePos[2])
    user.mesh.updateMatrix()
    camera.position.set(cPos.x + vrSpacePos[0], cPos.y + vrSpacePos[1], cPos.z + vrSpacePos[2])

    cursorIndex = world.systems.cursor.handleCursors( cursors, cursorIndex, hands, camera, world )
    world.sendUserData()
    world.systems.tick( delta, time )
    camera.updateMatrix();
    t.vrEffect.render(t.scene, t.camera) // Render the scene.
    // world.octree.update()
    display.requestAnimationFrame(()=> { vrAnimate( world, display, now, vrSpacePos, cursorIndex) }) // Keep looping.
}
