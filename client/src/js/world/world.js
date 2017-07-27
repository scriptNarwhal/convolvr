import axios from 'axios'
import { browserHistory } from 'react-router'
import { animate } from './render'
import { API_SERVER } from '../config.js'
import { send } from '../network/socket'
import Avatar from '../assets/entities/avatars/avatar'
import Entity from '../entity'
import Systems from '../systems'
import PostProcessing from './post-processing'
import SocketHandlers from '../network/handlers'
import initLocalSettings from './local-settings'
import { 
	compressFloatArray,
	compressVector3,
	compressVector4
} from '../network/util'


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
		this.userInput = userInput
		initLocalSettings( this )
		usePostProcessing = this.enablePostProcessing == 'on'
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1000+this.viewDistance*200, 15000000 + (3+this.viewDistance)*600000 )

		let rendererOptions = { antialias: this.aa != 'off' && !usePostProcessing }

		if ( usePostProcessing ) {

			rendererOptions.alpha = true
			rendererOptions.clearColor = 0x000000

		}

		renderer = new THREE.WebGLRenderer(rendererOptions)
		postProcessing = new PostProcessing(renderer, scene, camera)

		if ( usePostProcessing )

			postProcessing.init()


		this.postProcessing = postProcessing
		this.socket = socket
		this.config = false
		this.windowFocus = true
		this.name = "convolvr"
		this.userName = "space"
		this.mode = "3d" // web, stereo ( IOTmode should be set this way )
		this.rPos = false
		this.users = []
		this.user = user || {}
		this.camera = camera
		this.vrFrame = !!window.VRFrameData ? new VRFrameData() : null
		this.sendUpdatePacket = 0
		this.capturing = false
		this.webcamImage = ""
		this.HMDMode = "standard" // "head-movement"
		this.vrMovement = "stick" // teleport
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
		this.raycaster.near = 4000

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
		camera.add(this.systems.audio.listener)
		this.socketHandlers = new SocketHandlers( this, socket )

		function onResize () {

			world.screenResX = window.devicePixelRatio * window.innerWidth
			
			if ( three.world.mode != "stereo" )

				three.renderer.setSize(window.innerWidth, window.innerHeight)


			if ( world.postProcessing.enabled )

				world.postProcessing.onResize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
			

			three.camera.aspect = innerWidth / innerHeight
			three.camera.updateProjectionMatrix()

			if ( world.IOTMode ) 

				animate( world, Date.now(), 0 )
			

		}

		window.addEventListener('resize', onResize, true)
		this.onWindowResize = onResize
		onResize()	
		
		animate(this, 0, 0)

		three.vrDisplay = null
		
		navigator.getVRDisplays().then( displays => { console.log( "displays", displays )
				
			if ( displays.length > 0 )

				three.vrDisplay = displays[ 0 ]

			
		})

		loadedCallback( this )

	}

	init ( config, callback ) {
		
		let coords = window.location.href.indexOf("/at/") > -1 ? window.location.href.split('/at/')[1] : false,
			skyLight =  new THREE.DirectionalLight(config.light.color, 1),
			camera = three.camera,
			skyMaterial = new THREE.MeshBasicMaterial( {color: 0x303030} ),
			skyTexture = null,
			skybox = this.skybox

		
		this.config = config; console.log(config)
		this.terrain.initTerrain(config.terrain)
		this.ambientLight = new THREE.AmbientLight(config.light.ambientColor)
		three.scene.add(this.ambientLight)

		if ( !!config && !!config.sky.photosphere ) { console.log("init world: photosphere: ", config.sky.photosphere)

			this.systems.assets.envMaps.default = '/data/user/'+config.sky.photosphere

		} else {

			this.systems.assets.envMaps.default = '/data/images/textures/sky-reflection.jpg'

		}

		if ( !!! skybox ) {

			this.skybox = skybox = new THREE.Mesh(new THREE.OctahedronGeometry( 12000000+((this.viewDistance+3.5)*1.4)*600000, 4), skyMaterial )
		
		} else {

			skybox.material = skyMaterial

		}

		let deferWorldLoading = false,
			world = this,
			rebuildWorld = () => {

				let yaw = config.light.yaw - Math.PI / 2.0

				!!world.skyLight && three.scene.remove( world.skyLight )
				!!world.ambientLight && three.scene.remove( world.ambientLight )

				world.skyLight = skyLight
				three.scene.add(skyLight)
				skyLight.position.set( Math.sin(yaw)*3000000, Math.sin(config.light.pitch)*3000000, Math.cos(yaw)*3000000)
				skyLight.lookAt(new THREE.Vector3(0,0,0))
				three.scene.add(this.skybox)
				this.skybox.rotation.set(0, -Math.PI/2.0, 0)
				world.skybox.position.set(camera.position.x, 0, camera.position.z)

				world.terrain.bufferVoxels( true, 0 )

				world.gravity = config.gravity
				world.highAltitudeGravity = config.highAltitudeGravity
				callback()
			}

		if ( config.sky.skyType == 'shader' || config.sky.skyType == 'standard' ) {

			this.loadShaders( "/data/shaders/sky-vertex.glsl", "/data/shaders/sky-fragment.glsl", (vert, frag) => {

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
						terrainBlue: { type: "f", value: config.terrain.blue },
						lightYaw: { type: "f", value: config.light.yaw },
						lightPitch: { type: "f", value: config.light.pitch }
					},
					vertexShader: vert,
					fragmentShader: frag
				})

				skybox.material = skyMaterial

			}, error => {
				console.error("Error Loading Shaders: ", error)
			})	

		} else {
			// load sky texture 
			deferWorldLoading = true
			this.systems.assets.loadImage( '/data/user/'+this.config.sky.photosphere, {}, ( texture ) => {
				texture.magFilter = THREE.LinearFilter
	 			skybox.material = new THREE.MeshBasicMaterial({map: texture, side:1, fog: false})
				rebuildWorld()
			}) 

		}

		if ( coords ) {
			
			coords = coords.split(".")
			three.camera.position.fromArray([parseInt(coords[0])*928000, parseInt(coords[1])*807360, parseInt(coords[2])*807360])
			three.camera.updateMatrix()

		}

		document.title = config.name == 'overworld' && config.userName == 'space' ? `Convolvr` : config.name // make "Convolvr" default configurable via admin settings
		false == deferWorldLoading && rebuildWorld()

	}

	loadShaders (vertex_url, fragment_url, onLoad, onProgress, onError) { // based off http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/

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

	initRenderer ( renderer, id ) {

		let pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
		renderer.setClearColor(0x2b2b2b)
		renderer.setPixelRatio(pixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild( renderer.domElement )
		renderer.domElement.setAttribute("class", "viewport")
		renderer.domElement.setAttribute("id", id)
	}

	load ( userName, name, callback, readyCallback ) { console.log("load world", userName, name)

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

	reload ( user, name, place, coords, noRedirect ) {

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
		this.load( user, name )

		if ( !!! noRedirect )

			browserHistory.push("/"+(user||"space")+"/"+name+(!!place ? `/${place}` : ''))

		
	}

	generateFullLOD ( coords ) {

			let voxel = this.terrain.voxels[coords],
				scene = three.scene

			if ( voxel != null && voxel.cleanUp == false ) {

				voxel.entities.map( ( entity, i )=>{

					i > 1 && entity.init(scene)

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

		if ( this.sendUpdatePacket == 12 ) // send image

	    	imageSize = this.sendVideoFrame()

	
	  	this.sendUpdatePacket += 1

	  	if ( this.sendUpdatePacket %((3+(2*this.mode == "stereo"))*(mobile ? 2 : 1)) == 0 ) { // send packets faster / slower for all vr / mobile combinations

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
					position: compressVector3( camera.position, 4 ), //{x:camera.position.x, y:camera.position.y, z: camera.position.z},
					quaternion: compressVector4( camera.quaternion, 8 ), //{x: camera.quaternion.x, y: camera.quaternion.y, z: camera.quaternion.z, w:camera.quaternion.w}
				}
			
			})

			if ( this.capturing )

				this.webcamImage = ""

	    }
	}

	updateSkybox ( delta ) {

		let camera = three.camera,
			terrainMesh = this.terrain.mesh,
			skyMat = null

		if ( this.skybox ) {

			skyMat = this.skybox.material

			if ( skyMat ) {

				if ( skyMat.uniforms )

					skyMat.uniforms.time.value += delta

				this.skybox.position.set(camera.position.x, camera.position.y, camera.position.z)
				//this.skyLight.position.set(camera.position.x, camera.position.y+180000, camera.position.z+500000)
			}
    	}

		if ( terrainMesh ) {

			terrainMesh.position.x = camera.position.x
			terrainMesh.position.z = camera.position.z

		}
	}

	sendVideoFrame () { // probably going to remove this now that webrtc is in place

		let imageSize = [0, 0]

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
