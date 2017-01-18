var vrDisplay = null; // Get the VRDisplay and save it for later.
navigator.getVRDisplays().then(function(displays) {
  if (displays.length > 0) {
    vrDisplay = displays[0];
    // Kick off the render loop.
    vrDisplay.requestAnimationFrame(animate);
  }
});
// Request animation frame loop function
var lastRender = 0
function animate (timestamp) {
  var delta = Math.min(timestamp - lastRender, 500)
  lastRender = timestamp
  controls.update() // Update VR headset position and apply to camera.
  effect.render(scene, camera) // Render the scene.
  vrDisplay.requestAnimationFrame(animate) // Keep looping.
}

function onResize() {
  console.log('Resizing to %s x %s.', window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function onVRDisplayPresentChange() {
  console.log('onVRDisplayPresentChange');
  onResize();
}

// Resize the WebGL canvas when we resize and also when we change modes.
window.addEventListener('resize', onResize);
window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);

// Button click handlers.
document.querySelector('button#fullscreen').addEventListener('click', function() {
  enterFullscreen(renderer.domElement);
});
document.querySelector('button#vr').addEventListener('click', function() {
  vrDisplay.requestPresent([{source: renderer.domElement}]);
});
document.querySelector('button#reset').addEventListener('click', function() {
  vrDisplay.resetPose();
});

function enterFullscreen (el) {
  if (el.requestFullscreen) {
    el.requestFullscreen();
  } else if (el.mozRequestFullScreen) {
    el.mozRequestFullScreen();
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen();
  } else if (el.msRequestFullscreen) {
    el.msRequestFullscreen();
  }
}
