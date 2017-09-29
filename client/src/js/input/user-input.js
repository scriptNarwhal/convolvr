import Touch from './touch'
import Keyboard from './keyboard'
import GamePad from './gamepad'
import LeapMotion from './leap-motion'
import DeviceOrientationControls from './lib/device-orientation'

let isVRMode = (mode) => {
	return (mode == "3d" || mode == "stereo")
}

export default class UserInput {

	constructor ( socket ) {

		this.camera = {
			rotation: new THREE.Vector3()
		}
		this.device = {
			velocity: {
				x: 0, y: 0, z: 0
			}
		}
		this.castPos = new THREE.Vector2()
		this.world = null
		this.focus = false
		this.fullscreen = false
		this.rotationVector = {
			x: 0,
			y: 0,
			z: 0
		}
		this.tmpQuaternion = null
		this.moveVector = null
		this.keys = {
			q: false, 
			w: false, 
			e: false, 
			a: false, 
			s: false, 
			d: false, 
			r: false, 
			f: false, 
			shift: false, 
			space: false
		}
		this.lastTouch = [[0,0], [0,0]]
		this.tiltControls = null
		this.leapMotion = false
		this.leapMode = "hybrid"
		this.gamepadMode = false
		this.trackedControls = false
		this.handsDetected = 0
		this.gamepads = {},
		this.initDone = false
		
	}

	init ( world, camera, device ) {

		let uInput = this,
			viewport = document.querySelector("#viewport")
			
		this.connect( world, camera, device )
		uInput.rotationVector = {x: 0.2, y: 4.6, z: 0}
		viewport.requestPointerLock = viewport.requestPointerLock || viewport.mozRequestPointerLock || viewport.webkitRequestPointerLock;
		viewport.style.pointerEvents = ''

		if ("onpointerlockchange" in document) {

			document.addEventListener('pointerlockchange', ()=>{ uInput.lockChangeAlert(viewport)}, false)

		} else if ("onmozpointerlockchange" in document) {

			document.addEventListener('mozpointerlockchange', ()=>{ uInput.lockChangeAlert(viewport)}, false)

		} else if ("onwebkitpointerlockchange" in document) {
			
			document.addEventListener('webkitpointerlockchange', ()=>{ uInput.lockChangeAlert(viewport)}, false)

		}

		if (!world.mobile || world.IOTMode) {

			document.addEventListener("mousemove", function (e) {

				if (uInput.focus) {

					uInput.rotationVector.y  -=(e.movementX || e.mozMovementX || e.webkitMovementX || 0) / 600.0
					uInput.rotationVector.x  -=(e.movementY || e.mozMovementY || e.webkitMovementY || 0) / 600.0
				
				}

			})
			setTimeout(()=> {

				document.addEventListener("mousedown", e => {

					if ( world.mode != "web" ) {
						
						switch ( e.which ) {
							
							case 1: // left mouse
								this.user.toolbox.preview(0, 0) // right hand
							break
							case 2: // scroll wheel click
								// tools.selectObject() .. might be handy
							break
							case 3: // right click
								//this.user.toolbox.useSecondary(0, 1) // right hand // change tool option in forward direction
								// refactor this to grab entity
							break

						}
					}

				})

				document.addEventListener("mouseup", (e) => {
					
					if ( world.mode != "web" ) {
						
						switch ( e.which ) {
							
							case 1: // left mouse
								this.user.toolbox.usePrimary(0, 0) // right hand
							break
							case 2: // scroll wheel click
								// tools.selectObject() .. might be handy
							break
							case 3: // right click
								//this.user.toolbox.useSecondary(0, 1) // right hand // change tool option in forward direction
								// refactor this to grab entity
							break

						}
					}

				}, false)

			}, 250)

		} else {

			this.tiltControls = new DeviceOrientationControls(camera) // call disconnect once mobile vr mode starts
			
		}

		this.touchControls = new Touch(this)
		this.keyboard = new Keyboard(this, this.world)
		this.gamepad = new GamePad(this)
		this.leapControls = new LeapMotion(this, this.world)
		this.tmpQuaternion = new THREE.Quaternion()
		this.moveVector = new THREE.Vector3(0, 0, 0)
		this.initDone = true

	}

	connect ( world, camera, device ) {

		this.world = world
		this.camera = camera
		this.device = device
		this.user = this.world.user
		device.userInput = this
		this.cameraPos = new THREE.Vector3(0,0,0)

	}

	update ( delta ) {

		if ( !this.initDone ) {

			return

		}

		let world = this.world,
			terrain = world.terrain,
			terrainMesh = terrain.mesh,
			terrainConfig = terrain.config,
			terrainMode = '',
			bottom = -20,
			friction = 0,
			velocity = this.device.velocity //world.getElevation(this.camera.position);

		if ( terrainConfig && terrainMesh ) {

			terrainMode = terrainConfig.type

			if (terrainMode == "plane" || terrainMode == "both") {

				bottom = terrainMesh.position.y + 0.110 + world.vrHeight

			} else {

				bottom = 0.110 + world.vrHeight

			}

		}

		if ( isVRMode(world.mode) ) {

			this.keyboard.handleKeys(this)
			this.gamepad.update(this, world)

		}
		
		if ( world.mode != "stereo" ) {

			if ( this.tiltControls != null ) {

				this.tiltControls.update()

			} else {

				if ( world.cameraMode == 'fps' ) { // fps camera // make configurable

					this.camera.rotation.set(this.rotationVector.x, this.rotationVector.y, 0, "YXZ")
					//this.camera.rotateZ(this.rotationVector.z)

				} else { // vehicle camera

					this.tmpQuaternion.set( this.rotationVector.x, this.rotationVector.y, this.rotationVector.z, 1 ).normalize()
					this.rotationVector = {x: 0, y: 0, z: 0}
					this.camera.quaternion.multiply(this.tmpQuaternion)

				}
			}
		}
			
		velocity.add(this.moveVector.applyQuaternion(this.camera.quaternion).multiplyScalar(delta*0.08))

		if (this.leapMotion && this.moveVector.length() > 0) {

			if ( velocity.y < 0 )

				velocity.y *= 0.95

		}

		if ( Math.abs(velocity.y) < 0.2 )

			this.device.falling = true

		if ( world.gravity > 0 ) {

			if ( this.device.falling ) { //if not standing on something..

				if ( world.highAltitudeGravity || this.camera.position.y < 220.00 ) {

					velocity.y -= (0.0001 * (delta*0.40))  // apply gravity

				}
			}
					
		}

		this.moveVector.set( 0, 0, 0 )
		this.camera.matrix.makeRotationFromQuaternion(this.camera.quaternion)
		this.cameraPos.set( velocity.x*delta*0.00001, velocity.y*delta*0.00001, velocity.z*delta*0.00001 )
		this.camera.matrix.setPosition(this.camera.position.add( this.cameraPos ) );
		this.camera.matrixWorldNeedsUpdate = true

		if ( this.camera.position.y < bottom + 0.3330 ) {

			velocity.y *= this.keys.shift ? -0.70 : -0.20
			this.device.falling = false
			this.camera.position.y = bottom + 0.3330
				
			if ( velocity.y > 0.1 )

				window.navigator.vibrate && window.navigator.vibrate(50) // replace with haptics system
				
		}
			
		if ( this.device.falling == false ) { // (velocity.x * velocity.x) + (velocity.z * velocity.z) > 0.090 

			friction = 0.03

		} else {

			friction = 0.013

		}

		if ( this.keys.shift == true) {
					
			friction = 0.01

		}

		velocity.x *=  (1 - (friction * delta * 0.04))
		velocity.z *= (1 - (friction * delta * 0.04))

		if ( velocity.y > 0 )

			velocity.y *= (1 - (friction * delta * 0.04))

		if ( !!world.user.mesh ) {

			world.user.mesh.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z)

		}
	}

	lockChangeAlert ( canvas ) {

		var world = this.world,
			a = 0

		this.focus = (document.pointerLockElement===canvas||document.mozPointerLockElement===canvas||document.webkitPointerLockElement===canvas);
		this.fullscreen = this.focus
		console.log("focus", this.focus)

		if ( !this.fullscreen && world.user.username != "" ) {

			//world.showChat();
			world.mode = "web"
			document.body.setAttribute("class", "desktop")

		} else {

			if (world.user.username != "") {

				if (world.mode != "stereo") {

					world.mode = "3d"

				}
	
				document.body.setAttribute("class", "3d")

			}

		}

	}

	toggleFullscreen(elem) {

		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {

			this.fullscreen = true

			if (document.documentElement.requestFullscreen) {

				document.documentElement.requestFullscreen()

			} else if (document.documentElement.msRequestFullscreen) {

				document.documentElement.msRequestFullscreen()

			} else if (document.documentElement.mozRequestFullScreen) {

				document.documentElement.mozRequestFullScreen()

			} else if (document.documentElement.webkitRequestFullscreen) {

				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)

			}
		} else {

			this.fullscreen = false

			if (document.exitFullscreen) {

				document.exitFullscreen()

			} else if (document.msExitFullscreen) {

				document.msExitFullscreen()

			} else if (document.mozCancelFullScreen) {

				document.mozCancelFullScreen()

			} else if (document.webkitExitFullscreen) {

				document.webkitExitFullscreen()

			}
		}
	}

	teleport ( position ) {
		// implement
	}
}
