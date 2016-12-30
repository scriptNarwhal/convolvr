import Touch from './touch'
import Keyboard from './keyboard'
import GamePad from './gamepad'
import LeapMotion from './leap-motion'

let isVRMode = (mode) => {
	return (mode == "vr" || mode == "stereo");
}

export default class UserInput {
	constructor (socket) {
		this.camera = {
			rotation: new THREE.Vector3()
		};
		this.device = {
			velocity: {
				x: 0, y: 0, z: 0
			}
		};
		this.world = null;
		this.focus = false;
		this.fullscreen = false;
		this.rotationVector = {
			x: 0,
			y: 0,
			z: 0
		};
		this.tmpQuaternion = null;
		this.moveVector = null;
		this.keys = {
			w: false, a: false, s: false, d: false, r: false, f: false, shift: false, space: false
		},
		this.lastTouch = [[0,0], [0,0]];
		this.leapMotion = false;
		this.leapMode = "movement";
		this.gamepadMode = false;
		this.gamepads = {};
	}

	init (world, camera, device) {
		var uInput = this;
		this.connect(world, camera, device);
		uInput.rotationVector = {x: 0.2, y: 5.65, z: 0};
		var canvas = document.querySelector("canvas#viewport");
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
		canvas.onclick = (event) => {
			var elem = event.target;
			if (!uInput.fullscreen) {
				elem.requestPointerLock();
				uInput.toggleFullscreen();
			}
		};

		if ("onpointerlockchange" in document) {
			document.addEventListener('pointerlockchange', lockChangeAlert, false);
		} else if ("onmozpointerlockchange" in document) {
			document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
		} else if ("onwebkitpointerlockchange" in document) {
			document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);
		}

		function lockChangeAlert() {
			var a = 0;
			uInput.focus =(document.pointerLockElement===canvas||document.mozPointerLockElement===canvas||document.webkitPointerLockElement===canvas);
			uInput.fullscreen = uInput.focus;
			if (!uInput.fullscreen && world.user.username != "") {
				//world.showChat();
				//world.mode = "desktop";
				while (a < world.user.arms.length) {
					world.user.arms[a].visible = false;
					a ++;
				}
				document.body.setAttribute("class", "desktop");
			} else {
				if (world.user.username != "") {
					if (world.mode != "stereo") {
						world.mode = "vr";
					}
					while (a < world.user.arms.length) {
						world.user.arms[a].visible = true;
						a ++;
					}
					document.body.setAttribute("class", "vr");
				}
			}
		}
		if (!world.mobile) {
			document.addEventListener("mousemove", function (e) {
				if (uInput.focus) {
					uInput.rotationVector.y  -=(e.movementX || e.mozMovementX || e.webkitMovementX || 0) / 300.0;
					uInput.rotationVector.x  -=(e.movementY || e.mozMovementY || e.webkitMovementY || 0) / 300.0;
				}
			});
			document.addEventListener("mouseclick", (e) => {
				console.log(e);
				switch (e.which) {
					case 1: // left mouse
						tools.usePrimary(0); // right hand
					break;
					case 2: // scroll wheel click
						// tools.selectObject() .. might be handy
					break;

					case 3: // right click
						tools.useSecondary(0); // right hand
					break;
				}
			})
		}
		this.touchControls = new Touch(this);
		this.keyboard = new Keyboard(this, this.world);
		this.gamepad = new GamePad(this);
		this.leapControls = new LeapMotion(this, this.world);
		this.tmpQuaternion = new THREE.Quaternion();
		this.moveVector = new THREE.Vector3(0, 0, 0);
	}

	connect (world, camera, device) {
		this.world = world;
		this.camera = camera;
		this.device = device;
		device.userInput = this;
	}

	update (delta) {
		var bottom = -168000,
				world = this.world,
				velocity = this.device.velocity; //world.getElevation(this.camera.position);
		if (isVRMode(world.mode)) {
				this.keyboard.handleKeys(this);
				this.gamepad.update(this, world);
		}
			if (world.mode != "stereo") {
				this.camera.rotation.set(this.rotationVector.x, this.rotationVector.y, 0, "YXZ");
			}
			velocity.add(this.moveVector.applyQuaternion(this.camera.quaternion));
			if (this.leapMotion && this.moveVector.length() > 0) {
				if (velocity.y < 0) {
					velocity.y *= 0.95;
				}
			}
			velocity.y -= 500 + velocity.y * (0.005 * delta); // weak gravity
			this.moveVector.set(0, 0, 0);
			// if (this.camera.position.y < bottom + 500) {
			// 	if (this.keys.shift) {
			// 		velocity.y *= -0.70;
			// 	} else {
			// 		velocity.y *= -0.20;
			// 	}
			// 	this.device.falling = false;
			// 	this.camera.position.y = bottom + 500;
			// 	if (velocity.y > 1000) {
			// 		//world.vibrate(50);
			// 	}
			// }

			if (world.mode != "stereo") {
				this.camera.matrix.makeRotationFromQuaternion(this.camera.quaternion);
				this.camera.matrix.setPosition(this.camera.position.add(new THREE.Vector3(velocity.x*delta, velocity.y*delta, velocity.z*delta)) );
				this.camera.matrixWorldNeedsUpdate = true;
			}
			velocity.x *= 0.98;
			velocity.z *= 0.98;
			if (!! world.user.mesh) {
				world.user.mesh.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
				world.user.mesh.rotation.y = (this.camera.rotation.y);
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
