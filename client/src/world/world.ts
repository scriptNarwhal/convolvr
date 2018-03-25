import axios from 'axios'
import { browserHistory } from 'react-router'
import { animate } from './render'
import {
	API_SERVER,
	APP_NAME,
	GRID_SIZE,
	isMobile
} from '../config.js'
import { send } from '../network/socket'
import User from './user'
import Avatar from '../assets/entities/avatars/avatar'
import Entity from '../core/entity'
import Systems from '../systems'
import PostProcessing from './post-processing'
import SocketHandlers from '../network/handlers'
import SkyboxSystem from '../systems/environment/skybox'
import Settings from './local-settings'
import {
	compressFloatArray,
	compressVector3,
	compressVector4
} from '../network/util'


let world: any = null,
	THREE = (window as any).THREE,
	three: any;

export default class Convolvr {

	postProcessing:   PostProcessing
	initialLoad: 	  boolean
	loadedCallback:   Function
	sendUpdatePacket: number
	three:            any
	THREE:			  any
	socket: 		  any
	store: 			  any
	mobile: 		  boolean
	userInput: 		  UserInput
	settings: 		  Settings
	config: 		  Object
	windowFocus: 	  boolean
	willRender:       boolean
	name: 			  string
	userName: 		  string
	mode: 			  string
	rPos: 			  boolean
	users: 			  Array<User>
	user: 			  User
	camera: 		  any
	skyboxMesh: 	  any
	skybox: 		  SkyboxSystem
	vrFrame: 		  any
	capturing: 		  boolean
	webcamImage: 	  string
	HMDMode:		  string
	vrHeight: 		  number
	screenResX: 	  number
	octree: 		  any
	raycaster: 		  any
	systems: 		  Systems
	terrain: 		  TerrainSystem
	workers: 		  Object
	skyBoxMesh:       any
	skyLight:         any
	sunLight:         any
	shadowHelper:     any
	animate: 				 Function
	initChatAndLoggedInUser: Function

	constructor( user: User, userInput: UserInput, socket: any, store: any, loadedCallback: Function ) {

		let mobile = isMobile(),
			scene = new THREE.Scene(),
			camera = null,
			screenResX = window.devicePixelRatio * window.innerWidth,
			renderer = null,
			self = this,
			three = {},
			postProcessing: PostProcessing = null,
			usePostProcessing = false,
			viewDist = [ 0.1, 100000 ]

		this.store = store
		this.mobile = mobile
		this.willRender = true;
		this.userInput = userInput
		this.settings = new Settings( this )
		viewDist = [ 0.1, 2000 + (3+this.settings.viewDistance)*GRID_SIZE[0]*150 ]
		usePostProcessing = this.settings.enablePostProcessing == 'on'
		camera = new THREE.PerspectiveCamera( this.settings.fov, window.innerWidth / window.innerHeight, viewDist[ 0 ], viewDist[ 1 ] )
		this.onUserLogin = () => {}
		this.initChatAndLoggedInUser = () => {}
		let rendererOptions: any = { antialias: this.settings.aa && !usePostProcessing }

		if ( usePostProcessing ) {
			rendererOptions.alpha = true
			rendererOptions.clearColor = 0x000000
		}
		renderer = new THREE.WebGLRenderer(rendererOptions)
		if ( this.settings.shadows > 0 ) {
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		}
		postProcessing = new PostProcessing(renderer, scene, camera)
		if ( usePostProcessing )
			postProcessing.init()

		this.postProcessing = postProcessing
		this.socket = socket
		this.config = false
		this.windowFocus = true
		this.name = ""
		this.userName = "world"
		this.mode = "3d" // web, stereo ( IOTmode should be set this way )
		this.rPos = false
		this.users = []
		this.user = user || {} as User
 		this.camera = camera
		this.skyboxMesh = false
		this.vrFrame = !!(window as any).VRFrameData ? new VRFrameData() : null
		this.sendUpdatePacket = 0
		this.capturing = false
		this.webcamImage = ""
		this.HMDMode = "standard" // "head-movement"
		this.vrHeight = 1.66
		this.screenResX = screenResX
		this.initRenderer( renderer, "viewport" )
		this.octree = new THREE.Octree({
			undeferred: false,
			depthMax: Infinity,
			// max number of objects before nodes split or merge
			objectsThreshold: 8,
			// percent between 0 and 1 that nodes will overlap each other
			// helps insert objects that lie over more than one node
			overlapPct: 0.15,
			scene
		})

		this.octree.visualMaterial.visible = false
		this.raycaster = new THREE.Raycaster()
		this.raycaster.near = 0.25
		this.THREE = THREE
		three = this.three = {
			world: this,
			scene,
			camera,
			renderer,
			vrDisplay: null
		}

		world = this;
		(window as any).three = this.three

		this.systems = new Systems( this )
		this.terrain = this.systems.terrain
		this.skybox = this.systems.skybox
		this.workers = {
			staticCollisions: this.systems.staticCollisions.worker,
			// oimo: this.systems.oimo.worker
		}
		camera.add(this.systems.audio.listener)
		this.socketHandlers = new SocketHandlers( this, socket )
		window.addEventListener('resize', e => this.onWindowResize(), true)
		this.onWindowResize()
		animate(this, 0, 0)
		this.animate = animate;

		three.vrDisplay = null
		window.navigator.getVRDisplays().then( displays => { console.log( "displays", displays )
			if ( displays.length > 0 )
				three.vrDisplay = displays[ 0 ]

		})
		this.initialLoad = false
		this.loadedCallback = () => {
			loadedCallback( this );
			 this.initialLoad = true;
		}
	}

	startAnimation () { // for debugging
		this.animate(this, 0, 0)
	}

	init ( config: Object, callback: Function ) {

		let coords: any    = window.location.href.indexOf("/at/") > -1 ? window.location.href.split('/at/')[1] : false,
			skyLight 	   = this.skyLight || new THREE.DirectionalLight( config.light.color, 0.25 ),
			sunLight       = this.sunLight || new THREE.DirectionalLight( 0xffffff, config.light.intensity ),
			camera 		   = three.camera,
			skyMaterial    = new THREE.MeshBasicMaterial( {color: 0x303030} ),
			skyTexture     = null,
			rotateSky      = false,
			shadowRes      = 1024,
			envURL 	       = '/data/images/photospheres/sky-reflection.jpg',
			r 		       = config.sky.red,
			g 			   = config.sky.green,
			b 			   = config.sky.blue,
			shadowCam 	   = null,
			oldConfig 	   = Object.assign({}, this.config),
			skySize 	   = 1000+((this.settings.viewDistance+3.5)*1.4)*140,
			oldSkyMaterial = {}

		this.skyLight = skyLight
		this.sunLight = sunLight
		this.skyLight.color.set( config.light.color )
		this.skyLight.intensity = config.light.intensity / 1.2
		this.sunLight.intensity = config.light.intensity

		this.config = config; console.info("Space config: ", config)
		this.terrain.initTerrain(config.terrain)
		this.ambientLight = this.ambientLight || new THREE.AmbientLight(config.light.ambientColor, 1.1)
		this.ambientLight.color.set( config.light.ambientColor )
		Array(this.ambientLight, this.sunLight, this.skyLight).forEach( light => {
			if ( !!!light.parent ) {
				three.scene.add( light )
			}
		})
		if ( this.settings.shadows > 0 && sunLight.castShadow == false ) {
			sunLight.castShadow = true
			sunLight.shadowCameraVisible = true
			shadowCam = sunLight.shadow.camera
			sunLight.shadow.mapSize.width = this.mobile ? 256 : Math.pow( 2, 8+this.settings.shadows)
			sunLight.shadow.mapSize.height = this.mobile ? 256 : Math.pow( 2, 8+this.settings.shadows)
			shadowCam.near = 0.5      // default
			shadowCam.far = 1300000
			shadowCam.left = -400
			shadowCam.right = 400
			shadowCam.top = 500
			shadowCam.bottom = -500
			three.scene.add(shadowCam)

			if  ( !this.shadowHelper ) {
				this.shadowHelper = new THREE.CameraHelper( sunLight.shadow.camera );
				three.scene.add( this.shadowHelper );
			}
		}

		if ( !!config && !!config.sky.photosphere ) { console.log("init world: photosphere: ", config.sky.photosphere)
			this.systems.assets.envMaps.default = '/data/user/'+config.sky.photosphere
			rotateSky = true
		} else {
			envURL = this.systems.assets.getEnvMapFromColor( r, g, b )
			this.systems.assets.envMaps.default = envURL
		}

		oldSkyMaterial = this.skyboxMesh.material
		if (this.skyboxMesh.parent) {
			three.scene.remove(this.skyboxMesh)
		}
		this.skyboxMesh = this.skybox.createSkybox( skySize, oldSkyMaterial )

		let deferSpaceLoading = false,
			world = this,
			rebuildSpace = () => {

				let yaw = config.light.yaw - Math.PI / 2.0,
					zeroZeroZero = new THREE.Vector3(0,0,0)

				!!world.skyLight && three.scene.remove( world.skyLight )
				world.skyLight = skyLight
				skyLight.position.set( 0, 5000, 0 )
				sunLight.position.set( Math.sin(yaw)*1000, Math.sin(config.light.pitch)*1000, Math.cos(yaw)*1000)

				skyLight.lookAt(zeroZeroZero)
				sunLight.lookAt(zeroZeroZero)
				//sunLight.shadow.camera.lookAt(zeroZeroZero)

				world.skyboxMesh.position.set(camera.position.x, 0, camera.position.z)
				callback()
			}

		if ( config.sky.skyType == 'shader' || config.sky.skyType == 'standard' ) {
			this.skybox.loadShaderSky( config, oldConfig, world.skyboxMesh, ()=>{})
		} else {
			// load sky texture
			deferSpaceLoading = true
			this.skybox.loadTexturedSky( config.sky, this.skyboxMesh, skySize, ()=> {
				rebuildSpace()
			})
		}

		if ( coords ) {
			coords = coords.split(".")
			three.camera.position.fromArray([parseInt(coords[0])*GRID_SIZE[0], parseInt(coords[1])*GRID_SIZE[1], parseInt(coords[2])* GRID_SIZE[2] ])
			three.camera.updateMatrix()
		}

		document.title = config.name.toLowerCase() == 'overworld' && config.userName == APP_NAME.toLowerCase() ? APP_NAME : config.name // make "Convolvr" default configurable via admin settings
		false == deferSpaceLoading && rebuildSpace()
	}

	initRenderer ( renderer: any, id: string ) {
		renderer.setClearColor(0x1b1b1b)
		// renderer.setPixelRatio(pixelRatio)
		let customDPR = this.settings.dpr, // dpr = 0 == use highest dpr
			dpr = customDPR ? customDPR : window.devicePixelRatio;

		console.log("%device pixel ratio"+dpr, 'color:green;')
		renderer.setSize(window.innerWidth * dpr, window.innerHeight * dpr)
		document.body.appendChild( renderer.domElement )
		renderer.domElement.setAttribute("class", "viewport")
		renderer.domElement.setAttribute("id", id)
	}

	load ( userName: string, name: string, callback: Function, readyCallback: Function ) { console.log("load world", userName, name)
		let world = this

		this.name = name
		this.userName = userName
		console.log( this.systems.terrain )
		this.systems.terrain.readyCallback = readyCallback

		axios.get(`${API_SERVER}/api/spaces/name/${name}`).then( response => { // fix this... needs userName now
			 this.init(response.data, ()=> { callback && callback(world) } )
		}).catch(response => {
			console.log("Space Error", response)
		})
	}

	reload ( user: string, name: string, place: string, coords: Array<number>, noRedirect: boolean ) {
		let world = this,
			octree = this.octree

		this.terrain.destroy()
		this.workers.staticCollisions.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		//this.workers.oimo.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		// problem here
		console.info("reload ", this.skyboxMesh)
		this.skybox.destroy()
		this.load( user, name, () => {}, () => {} )

		if ( !!! noRedirect )
			browserHistory.push("/"+(user||"convolvr")+"/"+name+(!!place ? `/${place}` : ''))
	}

	generateFullLOD ( coords: Array<number> ) {
		let voxel = this.terrain.voxels[coords],
			scene = three.scene

		if ( voxel != null && voxel.cleanUp == false ) {
			voxel.entities.map( ( entity, i )=>{
				i > 2 && entity.init(scene)
			})
		}
	}

	sendUserData () {
		let camera 	  = three.camera,
			mobile 	  = this.mobile,
			input 	  = this.userInput,
			image 	  = "",
			imageSize = [0, 0],
			userHands = !!world.user.toolbox ? world.user.toolbox.hands : [],
			hands 	  = []

		if ( this.sendUpdatePacket == 12 ) // send image
	    	imageSize = this.sendVideoFrame()

	  	this.sendUpdatePacket += 1
	  	if ( this.sendUpdatePacket %((2+(2*this.mode == "stereo"))*(mobile ? 2 : 1)) == 0 ) { // send packets faster / slower for all vr / mobile combinations
			if ( input.trackedControls || input.leapMotion ) {
				userHands.forEach( handComponent => {
					let hand = handComponent.mesh

					hands.push({
						pos: compressFloatArray(hand.position.toArray(), 4),
						quat: compressFloatArray(hand.quaternion.toArray(), 8)
					})
				})
			}

			send( 'update', {
				entity: {
					id: this.user.id,
					username: this.user.name,
					image: this.webcamImage,
					avatar: this.user.data.avatar ? this.user.data.avatar : "default-avatar",
					imageSize,
					hands,
					position: compressVector3( camera.position, 4 ),
					quaternion: compressVector4( camera.quaternion, 8 ),
				}
			})

			if ( this.capturing )
				this.webcamImage = ""

	    }
	}

	getVoxel ( position: any ) {
		let pos = position || this.camera.position

		return [ Math.floor( pos.x / GRID_SIZE[ 0 ] ), 0, Math.floor( pos.z / GRID_SIZE[ 2 ] ) ]
	}

	onWindowResize () {
		let customDPI = this.settings.dpr,
			dpr = customDPI ? customDPI : window.devicePixelRatio;

		this.screenResX = dpr * window.innerWidth
		if ( this.mode != "stereo" ) {
			three.renderer.setSize(window.innerWidth * dpr, window.innerHeight * dpr)
			if ( this.postProcessing.enabled )
				this.postProcessing.onResize(window.innerWidth * dpr, window.innerHeight * dpr)

		}

		three.camera.aspect = innerWidth / innerHeight
		three.camera.updateProjectionMatrix()

		if ( this.IOTMode || this.willRender == false )
			animate( this, Date.now(), 0 )

	}

	sendVideoFrame () { // probably going to remove this now that webrtc is in place

		let imageSize: Array<number> = [0, 0]

		if ( this.capturing ) {

			let v = document.getElementById('webcam') as any,
					canvas = document.getElementById('webcam-canvas') as any,
					context = canvas.getContext('2d'),
					cw = Math.floor(v.videoWidth),
					ch = Math.floor(v.videoHeight)

			imageSize = [cw, ch]
			canvas.width = 320
			canvas.height = 240
			context.drawImage(v, 0, 0, 320, 240);
			this.webcamImage = canvas.toDataURL("image/jpg", 0.6)
	 	}
	 this.sendUpdatePacket = 0
	 return imageSize
	}
}
