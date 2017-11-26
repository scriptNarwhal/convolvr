import axios from 'axios'
import { browserHistory } from 'react-router'
import { animate } from './render'
import { 
	API_SERVER,
	GRID_SIZE
} from '../config.js'
import { send } from '../network/socket'
import User from './user'
import Avatar from '../assets/entities/avatars/avatar'
import Entity from '../entity'
import Systems from '../systems'
import PostProcessing from './post-processing'
import SocketHandlers from '../network/handlers'
import Settings from './local-settings'
import SkyBox from './skybox'
import { 
	compressFloatArray,
	compressVector3,
	compressVector4
} from '../network/util'


let world = null

export default class Convolvr {
	
	postProcessing:   PostProcessing
	initialLoad: 	  boolean
	loadedCallback:   Function
	sendUpdatePacket: number
	three:            Object
	socket: 		  any
	store: 			  any
	mobile: 		  boolean
	userInput: 		  UserInput
	settings: 		  Settings
	config: 		  Object
	windowFocus: 	  boolean
	name: 			  string
	userName: 		  string
	mode: 			  string
	rPos: 			  boolean
	users: 			  Array<User>
	user: 			  User
	camera: 		  any
	skyboxMesh: 	  any
	skybox: 		  SkyBox
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

	constructor( user: User, userInput: UserInput, socket: any, store: any, loadedCallback: Function ) {

		let mobile = window.innerWidth < 480 || (window.innerWidth < 1024 && window.devicePixelRatio >= 1.5),
			scene = new THREE.Scene(),
			camera = null,
			screenResX = window.devicePixelRatio * window.innerWidth,
			renderer = null,
			self = this,
			three = {},
			postProcessing = false,
			usePostProcessing = false,
			viewDist = [ 0.1, 100000 ]

		this.store = store
		this.mobile = mobile
		this.userInput = userInput
		this.settings= new Settings( this )
		viewDist = [ 0.1, 2000 + (3+this.settings.viewDistance)*GRID_SIZE[0]*150 ]
		usePostProcessing = this.settings.enablePostProcessing == 'on'
		camera = new THREE.PerspectiveCamera( this.settings.fov, window.innerWidth / window.innerHeight, viewDist[ 0 ], viewDist[ 1 ] )

		let rendererOptions = { antialias: this.settings.aa != 'off' && !usePostProcessing }

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
		this.user = user || {}
		this.camera = camera
		this.skyboxMesh = false
		this.vrFrame = !!window.VRFrameData ? new VRFrameData() : null
		this.sendUpdatePacket = 0
		this.capturing = false
		this.webcamImage = ""
		this.HMDMode = "standard" // "head-movement"
		this.vrHeight = 0
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

		three = this.three = {
			world: this,
			scene,
			camera,
			renderer,
			vrDisplay: null
		}

		world = this
		window.three = this.three
		this.systems = new Systems( this )
		this.terrain = this.systems.terrain
		this.workers = {
			staticCollisions: this.systems.staticCollisions.worker,
			// oimo: this.systems.oimo.worker
		}
		this.skybox = new SkyBox( this )
		camera.add(this.systems.audio.listener)
		this.socketHandlers = new SocketHandlers( this, socket )
		window.addEventListener('resize', e => this.onWindowResize( e ), true)
		this.onWindowResize()	
		animate(this, 0, 0)
	
		three.vrDisplay = null
		window.navigator.getVRDisplays().then( displays => { console.log( "displays", displays )
				
			if ( displays.length > 0 )
				three.vrDisplay = displays[ 0 ]

			
		})
		this.initialLoad = false
		this.loadedCallback = () => { loadedCallback( this ); this.initialLoad = true;  }
	}

	init ( config: Object, callback: Function ) {
		
		let coords 	 	   = window.location.href.indexOf("/at/") > -1 ? window.location.href.split('/at/')[1] : false,
			skyLight 	   = this.skyLight = new THREE.DirectionalLight( config.light.color, 1 ),
			sunLight       = this.sunLight = new THREE.DirectionalLight( 0xffffff, config.light.intensity ),
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

		this.config = config; console.info("World config: ", config)
		this.terrain.initTerrain(config.terrain)
		this.ambientLight = new THREE.AmbientLight(config.light.ambientColor)
		three.scene.add(this.ambientLight)
		three.scene.add(sunLight)

		if ( this.settings.shadows > 0 ) {

			sunLight.castShadow = true
			shadowCam = sunLight.shadow.camera
			sunLight.shadow.mapSize.width = this.mobile ? 256 : Math.pow( 2, 8+this.settings.shadows)  
			sunLight.shadow.mapSize.height = this.mobile ? 256 : Math.pow( 2, 8+this.settings.shadows) 
			shadowCam.near = 0.5      // default
			shadowCam.far = 1300      
			shadowCam.left = -500
			shadowCam.right = 500
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

		if ( this.skyboxMesh )

			three.scene.remove( this.skyBoxMesh )
		
		oldSkyMaterial = this.skyboxMesh.material

		this.skyboxMesh = new THREE.Mesh(new THREE.OctahedronGeometry( skySize, 4), oldSkyMaterial )

		let deferWorldLoading = false,
			world = this,
			rebuildWorld = () => {

				let yaw = config.light.yaw - Math.PI / 2.0,
					zeroZeroZero = new THREE.Vector3(0,0,0)

				!!world.skyLight && three.scene.remove( world.skyLight )
				!!world.ambientLight && three.scene.remove( world.ambientLight )

				world.skyLight = skyLight
				world.sunLight = sunLight
				three.scene.add(skyLight)
				skyLight.position.set( 0, 5000, 0 )
				sunLight.position.set( Math.sin(yaw)*1000, Math.sin(config.light.pitch)*1000, Math.cos(yaw)*1000)
				
				skyLight.lookAt(zeroZeroZero)
				sunLight.lookAt(zeroZeroZero)
				//sunLight.shadow.camera.lookAt(zeroZeroZero)
				three.scene.add(world.skyboxMesh)
				world.skyboxMesh.position.set(camera.position.x, 0, camera.position.z)
				callback()
			}

		if ( config.sky.skyType == 'shader' || config.sky.skyType == 'standard' ) {
			this.skybox.loadShaderSky( config, oldConfig, world.skyboxMesh, ()=>{})
		} else {
			// load sky texture 
			deferWorldLoading = true
			this.skybox.loadTexturedSky( config.sky, this.skyboxMesh, ()=> {
				rebuildWorld()
			}) 
		}

		if ( coords ) {
			coords = coords.split(".")
			three.camera.position.fromArray([parseInt(coords[0])*GRID_SIZE[0], parseInt(coords[1])*GRID_SIZE[1], parseInt(coords[2])* GRID_SIZE[2] ])
			three.camera.updateMatrix()
		}

		document.title = config.name.toLowerCase() == 'overworld' && config.userName == 'convolvr' ? `Convolvr` : config.name // make "Convolvr" default configurable via admin settings
		false == deferWorldLoading && rebuildWorld()
	}

	loadShaders ( vertex_url: string, fragment_url: string, onLoad: Function, onProgress: Function, onError: Function ) { // based off http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/

		var vertex_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager)
		vertex_loader.setResponseType('text')
		vertex_loader.load( vertex_url, vertex_text => {

			var fragment_loader = new THREE.XHRLoader(THREE.DefaultLoadingManager)
			fragment_loader.setResponseType('text')
			fragment_loader.load( fragment_url, fragment_text => {
				onLoad(vertex_text, fragment_text)
			});

		}, onProgress, onError)
	}

	initRenderer ( renderer: any, id: string ) {

		let pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
		renderer.setClearColor(0x2b2b2b)
		renderer.setPixelRatio(pixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
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
	
		axios.get(`${API_SERVER}/api/worlds/name/${name}`).then( response => { // fix this... needs userName now
			 this.init(response.data, ()=> { callback && callback(world) } )
		}).catch(response => {
			console.log("World Error", response)
		})
	}

	reload ( user: string, name: string, place: string, coords: Array<number>, noRedirect: boolean ) {

		let world = this,
			octree = this.octree

		this.terrain.voxelList.map( v => {
			v.entities.map(e => {
				if ( e.mesh ) {
					octree.remove( e.mesh )
					three.scene.remove( e.mesh )
				}					
			})

			if ( v.mesh )				
				three.scene.remove( v.mesh )

		})

		this.workers.staticCollisions.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		//this.workers.oimo.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		this.terrain.platforms = []
		this.terrain.voxels = {}
		this.terrain.voxelList = []
		this.skyboxMesh.parent.remove(this.skyboxMesh)
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
					username: this.user.username,
					image: this.webcamImage,
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

	updateSkybox ( delta: number ) {

		this.skybox.followUser( delta, false )
			
	}

	onWindowResize () {

		this.screenResX = window.devicePixelRatio * window.innerWidth
			
		if ( this.mode != "stereo" )

			three.renderer.setSize(window.innerWidth, window.innerHeight)



		if ( this.postProcessing.enabled )

			this.postProcessing.onResize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
			

		three.camera.aspect = innerWidth / innerHeight
		three.camera.updateProjectionMatrix()

		if ( this.IOTMode ) 

			animate( this, Date.now(), 0 )
			

	}

	sendVideoFrame () { // probably going to remove this now that webrtc is in place

		let imageSize: Array<number> = [0, 0]

		if ( this.capturing ) {

			let v = document.getElementById('webcam'),
					canvas = document.getElementById('webcam-canvas'),
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
