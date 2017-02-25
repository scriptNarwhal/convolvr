import Touch from './touch'
import Keyboard from './keyboard'
import GamePad from './gamepad'
import LeapMotion from './leap-motion'

let isVRMode = (mode) => {
	return (mode == "vr" || mode == "stereo")
}

export default class UserInput {
	constructor (socket) {
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
			w: false, a: false, s: false, d: false, r: false, f: false, shift: false, space: false
		}
		this.lastTouch = [[0,0], [0,0]]
		this.leapMotion = false
		this.leapMode = "movement"
		this.gamepadMode = false
		this.gamepads = {},
		this.initDone = false
	}

	init (world, camera, device) {
		let uInput = this,
				viewport = document.querySelector("#viewport")
		this.connect(world, camera, device)
		uInput.rotationVector = {x: 0.2, y: 4.6, z: 0}

				viewport.requestPointerLock = viewport.requestPointerLock || viewport.mozRequestPointerLock || viewport.webkitRequestPointerLock;
				viewport.onclick = (event) => {
					let elem = event.target;
					if (!uInput.fullscreen) {
						elem.requestPointerLock()
						uInput.toggleFullscreen()
					}
				};
				viewport.style.pointerEvents = ''
				if ("onpointerlockchange" in document) {
					document.addEventListener('pointerlockchange', ()=>{ uInput.lockChangeAlert(viewport)}, false)
				} else if ("onmozpointerlockchange" in document) {
					document.addEventListener('mozpointerlockchange', ()=>{ uInput.lockChangeAlert(viewport)}, false)
				} else if ("onwebkitpointerlockchange" in document) {
					document.addEventListener('webkitpointerlockchange', ()=>{ uInput.lockChangeAlert(viewport)}, false)
				}


		if (!world.mobile) {
			document.addEventListener("mousemove", function (e) {
				if (uInput.focus) {
					uInput.rotationVector.y  -=(e.movementX || e.mozMovementX || e.webkitMovementX || 0) / 300.0
					uInput.rotationVector.x  -=(e.movementY || e.mozMovementY || e.webkitMovementY || 0) / 300.0
				}
			});
			setTimeout(()=> {
				document.addEventListener("mousedown", (e) => {
					if (world.mode != "web") {
						switch (e.which) {
							case 1: // left mouse
								this.user.toolbox.usePrimary(0) // right hand
							break;
							case 2: // scroll wheel click
								// tools.selectObject() .. might be handy
							break;

							case 3: // right click
								this.user.toolbox.useSecondary(0) // right hand
							break;
						}
					}
				}, false)
			},250)

		}
		this.touchControls = new Touch(this)
		this.keyboard = new Keyboard(this, this.world)
		this.gamepad = new GamePad(this)
		this.leapControls = new LeapMotion(this, this.world)
		this.tmpQuaternion = new THREE.Quaternion()
		this.moveVector = new THREE.Vector3(0, 0, 0)
		this.initDone = true
	}

	connect (world, camera, device) {
		this.world = world
		this.camera = camera
		this.device = device
		this.user = this.world.user
		device.userInput = this
	}

	update (delta) {
		if (!this.initDone) {
			return
		}
		let world = this.world,
				terrainMesh = world.terrain.mesh,
				terrainMode = '',
				bottom = -600000,
				velocity = this.device.velocity; //world.getElevation(this.camera.position);
		if (world.terrain.config) {
			terrainMode = world.terrain.config.type
			if (terrainMode == "plane" || terrainMode == "both") {
				bottom = terrainMesh.position.y + 6000 + world.vrHeight
			}
		}
		if (isVRMode(world.mode)) {
				this.keyboard.handleKeys(this)
				this.gamepad.update(this, world)
		}
			if (world.mode != "stereo") {
				if (world.cameraMode == 'fps') { // fps camera // make configurable
					this.camera.rotation.set(this.rotationVector.x, this.rotationVector.y, 0, "YXZ")
				} else { // vehicle camera
					this.tmpQuaternion.set( this.rotationVector.x, this.rotationVector.y, this.rotationVector.z, 1 ).normalize()
					this.rotationVector = { x: 0, y: 0, z: 0}
					this.camera.quaternion.multiply( this.tmpQuaternion )
				}
			}
			velocity.add(this.moveVector.applyQuaternion(this.camera.quaternion).multiplyScalar(delta*3000))

			if (this.leapMotion && this.moveVector.length() > 0) {
				if (velocity.y < 0) {
					velocity.y *= 0.95
				}
			}
			if (Math.abs(velocity.y) > 6000) {
				this.device.falling = true
			}
			if (this.device.falling) { //if not standing on something..
				velocity.y -= 2000 * (delta*16000) // apply gravity
			}
			this.moveVector.set(0, 0, 0)
			this.camera.matrix.makeRotationFromQuaternion(this.camera.quaternion);
			this.camera.matrix.setPosition(this.camera.position.add(new THREE.Vector3(velocity.x*delta, velocity.y*delta, velocity.z*delta)) );
			this.camera.matrixWorldNeedsUpdate = true
			if (this.camera.position.y < bottom + 12000) {
				if (this.keys.shift) {
					velocity.y *= -0.70;
				} else {
					velocity.y *= -0.20;
				}
				this.device.falling = false
				this.camera.position.y = bottom + 12000
				if (velocity.y > 1000) {
					//world.vibrate(50);
				}
			}
			if ((velocity.x * velocity.x) + (velocity.z * velocity.z) > 20000) {
					velocity.x *=  (1 - (0.01 * delta * 1000))
					velocity.z *= (1 - (0.01 * delta * 1000))
			}
			if (!! world.user.mesh) {
				world.user.mesh.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z)
			}
	}

	lockChangeAlert (canvas) {
		console.log("lock change alert")
		var a = 0,
				world = this.world
		this.focus =(document.pointerLockElement===canvas||document.mozPointerLockElement===canvas||document.webkitPointerLockElement===canvas);
		this.fullscreen = this.focus
		console.log("focus", this.focus)
		if (!this.fullscreen && world.user.username != "") {
			//world.showChat();
			world.mode = "web";
			while (a < world.user.hands.length) {
				world.user.hands[a].visible = false;
				a ++;
			}
			document.body.setAttribute("class", "desktop");
		} else {
			if (world.user.username != "") {
				if (world.mode != "stereo") {
					world.mode = "vr";
				}
				while (a < world.user.hands.length) {
					world.user.hands[a].visible = true;
					a ++;
				}
				document.body.setAttribute("class", "vr");
			}
		}
	}

	toggleFullscreen (elem) {
		if (!document.fullscreenElement &&
			!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
				this.fullscreen = true;
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				this.fullscreen = false;
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
		}
}
