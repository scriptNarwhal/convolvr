import Touch from './touch'
import Keyboard from './keyboard'
import Mouse from './mouse'
import GamePad from './gamepad'
import LeapMotion from './leap-motion'
import DeviceOrientationControls from './lib/device-orientation'
import Convolvr from '../world/world'
import { isVRMode } from '../config'

export default class UserInput {

	camera: 		any
	device: 		Object
	castPos: 		any
	world: 			Convolvr
	initDone: 		boolean
	focus: 			boolean
	fullscreen: 	boolean
	rotationVector: Object
	tmpQuaternion:  any
	moveVector:     any
	keys: 		    Object
	lastTouch: 	    Array<Array<number>>
	tiltControls:   DeviceOrientationControls
	touchControls:  Touch
	keyboard:  		Keyboard
	mouse:          Mouse
	gamepad: 		Gamepad
	leapControls: 	LeapMotion

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
		this.moveVector = new THREE.Vector3(0, 0, 0)
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
		this.gamepads = {}
		this.initDone = false
		
	}

	init ( world, camera, device ) {
		let uInput = this,
			mouse = null

		this.rotationVector = {x: 0.2, y: 4.6, z: 0}	
		this.connect( world, camera, device )
		mouse = new Mouse( this, world )

		if ( !world.mobile || world.IOTMode ) {
			mouse.init()
		} else {
			this.tiltControls = new DeviceOrientationControls( camera ) // call disconnect once mobile vr mode starts
		}
		this.mouse = mouse
		this.touchControls = new Touch(this)
		this.keyboard = new Keyboard(this, this.world)
		this.gamepad = new GamePad(this)
		this.leapControls = new LeapMotion(this, this.world)
		this.tmpQuaternion = new THREE.Quaternion()
		this.initDone = true
	}

	connect ( world: Convolvr, camera: any, device: any ) {
		this.world = world
		this.camera = camera
		this.device = device
		this.user = this.world.user
		device.userInput = this
		this.cameraPos = new THREE.Vector3(0,0,0)
	}

	update ( delta: number ) {

		if ( !this.initDone )
			return

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
				bottom = terrainMesh.position.y +1.5 + world.vrHeight
			} else {
				bottom = 2.0 + world.vrHeight
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
				if ( world.settings.cameraMode == 'fps' ) { // fps camera // make configurable
					this.camera.rotation.set(this.rotationVector.x, this.rotationVector.y, 0, "YXZ")
					//this.camera.rotateZ(this.rotationVector.z)
				} else { // vehicle camera
					this.tmpQuaternion.set( this.rotationVector.x, this.rotationVector.y, this.rotationVector.z, 1 ).normalize()
					this.rotationVector = {x: 0, y: 0, z: 0}
					this.camera.quaternion.multiply(this.tmpQuaternion)
				}
			}
		}
			
		velocity.add( this.moveVector.applyQuaternion(this.camera.quaternion).multiplyScalar(delta*0.08) )

		if (this.leapMotion && this.moveVector.length() > 0) {
			if ( velocity.y < 0 )
				velocity.y *= 0.95

		}

		if ( Math.abs(velocity.y) > 0.2 )
			this.device.falling = true

		if ( world.settings.gravity > 0 ) {
			if ( this.device.falling ) { //if not standing on something..
				if ( world.settings.highAltitudeGravity || this.camera.position.y < 220.00 )
					velocity.y -= 0.016 * delta  // apply gravity

			}			
		}

		this.moveVector.set( 0, 0, 0 )
		this.camera.matrix.makeRotationFromQuaternion( this.camera.quaternion )
		this.cameraPos.set( velocity.x*delta*0.00001, velocity.y*delta*0.00001, velocity.z*delta*0.00001 )
		this.camera.matrix.setPosition( this.camera.position.add( this.cameraPos ) );
		this.camera.matrixWorldNeedsUpdate = true

		if ( this.camera.position.y < bottom + 0.3330 ) {
			velocity.y *= this.keys.shift ? -0.80 : -0.25
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
		if ( this.keys.shift == true )		
			friction = 0.01

		velocity.x *= (1 - (friction * delta * 0.04))
		velocity.z *= (1 - (friction * delta * 0.04))

		if ( velocity.y > 0 )
			velocity.y *= ( 1 - (friction * delta * 0.04) )

		if ( !!world.user.mesh )
			world.user.mesh.position.set( this.camera.position.x, this.camera.position.y, this.camera.position.z )
	}

	toggleFullscreen( elem ) {

		if ( !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {

			this.fullscreen = true

			if ( document.documentElement.requestFullscreen ) {
				document.documentElement.requestFullscreen()
			} else if ( document.documentElement.msRequestFullscreen ) {
				document.documentElement.msRequestFullscreen()
			} else if ( document.documentElement.mozRequestFullScreen ) {
				document.documentElement.mozRequestFullScreen()
			} else if ( document.documentElement.webkitRequestFullscreen ) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
			}
		} else {

			this.fullscreen = false
			if ( document.exitFullscreen ) {
				document.exitFullscreen()
			} else if ( document.msExitFullscreen ) {
				document.msExitFullscreen()
			} else if ( document.mozCancelFullScreen ) {
				document.mozCancelFullScreen()
			} else if ( document.webkitExitFullscreen ) {
				document.webkitExitFullscreen()
			}
		}
	}

	teleport ( position ) {
		// implement
	}
}
