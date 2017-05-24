import axios from 'axios'
import { browserHistory } from 'react-router'
import { animate } from './render'
import { API_SERVER } from '../config.js'
import { send } from '../network/socket'
import Avatar from '../assets/avatars/avatar'
import Entity from '../entity'
import Systems from '../systems'
import PostProcessing from './post-processing'
import SocketHandlers from '../network/handlers'

let world = null

export default class Convolvr {
	
	constructor( user, userInput = false, socket, store, loadedCallback ) {

		let mobile = (window.innerWidth <= 720),
			scene = new THREE.Scene(),
			camera = null,
			screenResX = window.devicePixelRatio * window.innerWidth,
			renderer = null,
			self = this,
			three = {},
			postProcessing = false,
			usePostProcessing = false

		//scene.scale.setScalar( 1 / 22000 ) 
		this.mobile = mobile
		this.floorHeight = 0
		this.highAltitudeGravity = false
		this.viewDistance = 0 // default
		this.initLocalSettings()
		usePostProcessing = this.enablePostProcessing == 'on'
		camera = new THREE.PerspectiveCamera( 78, window.innerWidth / window.innerHeight, 1000+this.viewDistance*200, 15000000 + this.viewDistance*600000 )

		let rendererOptions = {antialias: this.aa != 'off' && !usePostProcessing}

		if ( usePostProcessing ) {

			rendererOptions.alpha = true
			rendererOptions.clearColor = 0x000000

		}

		renderer = new THREE.WebGLRenderer(rendererOptions)
		postProcessing = new PostProcessing(renderer, scene, camera)

		if ( usePostProcessing ) {

			postProcessing.init()

		}

		this.postProcessing = postProcessing
		this.socket = socket
		this.config = false
		this.windowFocus = true
		this.name = "convolvr"
		this.mode = "vr"
		this.rPos = false
		this.users = []
		this.user = user || {}
		this.camera = camera
		this.vrFrame = !!window.VRFrameData ? new VRFrameData() : null
		this.userInput = userInput
		this.sendUpdatePacket = 0
		this.capturing = false
		this.webcamImage = ""
		this.HMDMode = "standard" // "head-movement"
		this.vrMovement = "stick" // teleport
		this.vrHeight = 0
		this.screenResX = screenResX
		this.initRenderer(renderer, "viewport")
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
			worldPhysics: this.systems.worldPhysics.worker,
			entityPhysics: this.systems.entityPhysics.worker
		}
		camera.add(this.systems.audio.listener)
		this.socketHandlers = new SocketHandlers(this, socket)

		function onResize () {

			world.screenResX = window.devicePixelRatio * window.innerWidth
			
			if ( three.world.mode != "stereo" ) {

				three.renderer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)

			}

			if ( world.postProcessing.enabled ) {

				world.postProcessing.onResize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
			}

			three.camera.aspect = innerWidth / innerHeight
			three.camera.updateProjectionMatrix()

			if ( world.IOTMode ) {
				animate( world, Date.now(), 0 )
			}

		}
		window.addEventListener('resize', onResize, true)
		this.onWindowResize = onResize
		onResize()	
		
		animate(this, 0, 0)

		three.vrDisplay = null
		navigator.getVRDisplays().then(function(displays) { console.log("displays", displays)
			
		  if (displays.length > 0) {

		    three.vrDisplay = displays[0]

		  }
		  
		})

		loadedCallback( this )

	}

	init (config) {
		
		let skyLight =  new THREE.DirectionalLight(config.light.color, 1),
				camera = three.camera,
				skyMaterial = null,
				skybox = null

		console.log(config)
		this.config = config;
		this.terrain.initTerrain(config.terrain)
		this.ambientLight = new THREE.AmbientLight(config.light.ambientColor)
		three.scene.add(this.ambientLight);

		if ( config.sky.skyType == 'shader' || config.sky.skyType == 'standard' ) {

			skyMaterial = new THREE.ShaderMaterial({
				side: 1,
				fog: false,
				uniforms: {
					time: { type: "f", value: 1.0 },
					red: { type: "f", value: config.sky.red },
					green: { type: "f", value: config.sky.green },
					blue: { type: "f", value: config.sky.blue },
					terrainRed: { type: "f", value: config.terrain.red },
					terrainGreen: { type: "f", value: config.terrain.green },
					terrainBlue: { type: "f", value: config.terrain.blue }
				},
				vertexShader: document.getElementById('sky-vertex').textContent,
				fragmentShader: document.getElementById('sky-fragment').textContent
			})

		} else {
			// load sky texture // deprecated ..migrating to world.systems.assets
			skyMaterial = new THREE.MeshBasicMaterial({color:0x303030})
			let skyTexture = THREE.ImageUtils.loadTexture('/data/user/'+this.config.sky.photosphere, false, function() {
				 	skyTexture.magFilter = THREE.LinearFilter
	 				skybox.material = new THREE.MeshBasicMaterial({map: skyTexture, side:1, fog: false})
			})
		}

		//handle re-initialization here..
		let coords = window.location.href.indexOf("/at/") > -1 ? window.location.href.split('/at/')[1] : false
		if ( coords ) {

			coords = coords.split(".")
			three.camera.position.fromArray([parseInt(coords[0])*928000, parseInt(coords[1])*807360, parseInt(coords[2])*807360])
			three.camera.updateMatrix()

		}
		
		skybox = this.skybox = new THREE.Mesh(new THREE.OctahedronGeometry(12000000+this.viewDistance*600000, 4), skyMaterial)
		this.skyLight = skyLight
		three.scene.add(skyLight)
		three.scene.add(this.skybox)
		this.skybox.position.set(camera.position.x, 0, camera.position.z)
		skyLight.position.set(2000000, 2000000, 4000000)
		this.terrain.bufferChunks(true, 0)
		this.gravity = config.gravity
		this.highAltitudeGravity = config.highAltitudeGravity

	}

	initRenderer ( renderer, id ) {

		let pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
		renderer.setClearColor(0x1b1b1b)
		renderer.setPixelRatio(pixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild( renderer.domElement )
		renderer.domElement.setAttribute("class", "viewport")
		renderer.domElement.setAttribute("id", id)
	}

	initLocalSettings () {

		let cameraMode = localStorage.getItem("camera"),
			vrMovement = localStorage.getItem("vrMovement"),
			IOTMode = localStorage.getItem("IOTMode"),
			lighting = localStorage.getItem("lighting"),
			enablePostProcessing = localStorage.getItem("postProcessing"),
			aa = localStorage.getItem("aa"),
			floorHeight = localStorage.getItem("floorHeight"),
			viewDistance = localStorage.getItem("viewDistance")

		if ( cameraMode == null ) {

			cameraMode = 'fps'
			localStorage.setItem("camera", 'fps')

		}

		if ( vrMovement == null ) {

			vrMovement = 'stick' // change to teleport later
			localStorage.setItem("vrMovement", vrMovement)

		}

		if ( IOTMode == null ) {

			IOTMode = 'off'
			localStorage.setItem("IOTMode", IOTMode)

		}

		if ( aa == null ) {

			aa = 'on'
			localStorage.setItem("aa", aa)

		}

		if ( lighting == null ) {

			lighting = 'high'
			localStorage.setItem("lighting", !this.mobile ? 'high' : 'low')

		}

		if ( enablePostProcessing == null ) {

			enablePostProcessing = 'off'
			localStorage.setItem("postProcessing", enablePostProcessing)

		}

		if ( floorHeight == null ) {

			floorHeight = 0
			localStorage.setItem("floorHeight", floorHeight)

		} 

		if ( viewDistance == null ) {

			viewDistance = 0
			localStorage.setItem("viewDistance", 0)

		} else {

			viewDistance = parseInt(viewDistance)

		}

		this.aa = aa
		this.viewDistance = viewDistance
		this.cameraMode = cameraMode
		this.vrMovement = vrMovement
		this.lighting = lighting
		this.enablePostProcessing = enablePostProcessing
		this.IOTMode = IOTMode == 'on'
		this.floorHeight = parseInt(floorHeight)

	}

	load ( name, callback ) {

		this.name = name;
		// fix this... needs userName now
		axios.get(`${API_SERVER}/api/worlds/name/${name}`).then(response => {
			 this.init(response.data)
			 callback && callback(this)
		}).catch(response => {
			console.log("World Error", response)
		})

	}

	reload ( user, name, place, coords ) {

		let world = this,
			octree = this.octree

		if ( !!this.skyLight ) {

			three.scene.remove(this.skyLight)

		}

		if ( !!this.ambientLight ) {

			three.scene.remove(this.ambientLight)

		}

		if ( !!this.skybox ) {

			three.scene.remove(this.skybox)

		}

		if ( !!this.terrain.mesh ) {

			three.scene.remove(this.terrain.mesh)

		}

		this.terrain.voxelList.map(p => {

			p.entities.map(e => {
				
				if (e.mesh) {

					octree.remove(e.mesh)
					three.scene.remove(e.mesh)

				}
					
			})

			if (p.mesh) {
				
				three.scene.remove(p.mesh)

			}

		})

		this.workers.worldPhysics.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		this.workers.entityPhysics.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		this.terrain.platforms = []
		this.terrain.voxels = {}
		this.terrain.voxelList = []
		this.load(name)
		browserHistory.push("/"+(user||"space")+"/"+name+(!!place ? `/${place}` : ''))
		
	}

	generateFullLOD ( coords ) {

			let voxel = this.terrain.voxels[coords],
				scene = three.scene

			if (voxel != null && voxel.cleanUp == false) {

				voxel.entities.map(entity=>{

					entity.init(scene)

				})

			}
	}

	sendUserData () {

		let camera = three.camera,
			mobile = this.mobile,
			image = "",
			imageSize = [0, 0],
			input = this.userInput,
			userHands = !!world.user.toolbox ? world.user.toolbox.hands : [],
			hands = []

		if (this.sendUpdatePacket == 12) { // send image

	    	imageSize = this.sendVideoFrame()

	  	}

	  	this.sendUpdatePacket += 1

	  	if (this.sendUpdatePacket %((2+(1*this.mode == "stereo"))*(mobile ? 2 : 1)) == 0) {

			if (input.trackedControls || input.leapMotion) {

				userHands.forEach( handComponent => {

					let hand = handComponent.mesh

					hands.push( {pos: hand.position.toArray(), quat: hand.quaternion.toArray() } )

				})
			}

			send('update', {

				entity: {
					id: this.user.id,
					username: this.user.username,
					image: this.webcamImage,
					imageSize,
					hands,
					position: {x:camera.position.x, y:camera.position.y, z: camera.position.z},
					quaternion: {x: camera.quaternion.x, y: camera.quaternion.y, z: camera.quaternion.z, w:camera.quaternion.w}
				}
			
			})

			if ( this.capturing ) {

				this.webcamImage = ""

			}
	    }
	}

	updateSkybox (delta) {

		let camera = three.camera,
				terrainMesh = this.terrain.mesh,
				skyMat = null

		if (this.skybox) {

			skyMat = this.skybox.material

			if (skyMat) {

				if (skyMat.uniforms) {

					skyMat.uniforms.time.value += delta

				}
				this.skybox.position.set(camera.position.x, camera.position.y, camera.position.z)
				//this.skyLight.position.set(camera.position.x, camera.position.y+180000, camera.position.z+500000)
			}
    	}

		if (terrainMesh) {

			terrainMesh.position.x = camera.position.x
			terrainMesh.position.z = camera.position.z

		}
	}

	sendVideoFrame () { // probably going to remove this now that webrtc is in place

		let imageSize = [0, 0]
		if (this.capturing) {
		 let v = document.getElementById('webcam'),
				 canvas = document.getElementById('webcam-canvas'),
				 context = canvas.getContext('2d'),
				 cw = Math.floor(v.videoWidth),
				 ch = Math.floor(v.videoHeight),

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
