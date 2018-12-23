import axios from 'axios'
import * as THREE from 'three';
import THREEJSPluginLoader from '../lib';
// import * as ProgressBar from 'progressbardottop';
import { 
	animate,
	vrAnimate
} from './render'
import {
	API_SERVER,
	APP_NAME,
	GRID_SIZE,
	isMobile,
	GLOBAL_SPACE
} from '../config'
import { SpaceConfig } from '../model/space'
import { send } from '../network/socket'
import User from './user'
import Avatar from '../assets/entities/avatars/avatar'
import Entity from '../model/entity'
import Systems from '../systems'
import PostProcessing from './post-processing'
import SocketHandlers from '../network/handlers'
import SkyboxSystem from '../systems/environment/skybox'
import SpaceSystem from '../systems/environment/space'
import Settings from './local-settings'
import {
	compressFloatArray,
	compressVector3,
	compressVector4
} from '../network/util'
import UserInput from '../input/user-input'
import Component from '../model/component';
import { zeroZeroZero } from '../util';
import { Camera, Light, SpotLight, PointLight, PerspectiveCamera, DirectionalLight } from 'three';

let world: any = null,
	//THREE = (window as any).THREE,
	three: any;
	// (window as any).THREE = THREE;

export default class Convolvr {

	public postProcessing:      PostProcessing
	public threeJsPluginLoader: THREEJSPluginLoader
	public initialLoad: 	    boolean
	public loadedCallback:      Function
	public sendUpdatePacket:    number

	public three:        any
	public THREE:		 any
	public socket: 		 any
	public store: 		 any
	public mobile: 		 boolean
	public ambientLight:   any
	public socketHandlers: any
	public userInput:    UserInput = new UserInput(null);
	public settings: 	 Settings
	public config: 		 SpaceConfig
	public windowFocus:  boolean
	public willRender:   boolean
	public name: 	     string
	public userName: 	 string
	public mode: 	     string
	public users: 		 Array<User>
	public user:         User     = new User({});
	public camera: 		 any
	public skyboxMesh: 	 any
	public help:         any
	public skybox: 		 SkyboxSystem
	public vrFrame: 	 any
	public capturing: 	 boolean
	public webcamImage:  string
	public HMDMode:		 string
	public IOTMode: 	 any
	public vrHeight: 	 number
	public screenResX: 	 number
	// public octree: 		 any
	public raycaster: 	 any
	public systems: 	 Systems
	public space: 	 SpaceSystem
	public workers: 	 any
	public skyBoxMesh:   any
	public skyLight:     any
	public sunLight:     any
	public shadowHelper: any

	public animate: 				Function
	public onUserLogin: 			Function
	public onFocusCallback:         Function
	public clickCanvasCallback:     Function
	public toggleVRButtonCallback:  Function
	public rememberUserCallback:    Function
	public initChatCallback:        Function

	constructor(socket: any, store: any, loadedCallback: Function) {
		let mobile = isMobile(),
			scene = new THREE.Scene(),
			camera = null,
			screenResX = window.devicePixelRatio * window.innerWidth,
			renderer = null,
			self = this,
			three: any = {},
			postProcessing: PostProcessing = null,
			usePostProcessing = false,
			viewDist = [ 0.1, 100000 ]

		this.store = store
		this.mobile = mobile
		this.willRender = true;
		this.settings = new Settings( this )
		viewDist = [ 0.1, 2000 + (3+this.settings.viewDistance)*GRID_SIZE[0]*150 ]
		usePostProcessing = (this.settings as any).enablePostProcessing
		camera = new THREE.PerspectiveCamera( this.settings.fov, window.innerWidth / window.innerHeight, viewDist[ 0 ], viewDist[ 1 ] )
		this.onUserLogin = () => {}
		this.initChatAndLoggedInUser = () => {}
		let rendererOptions: any = { antialias: this.settings.aa && !usePostProcessing }

		if ( usePostProcessing ) {
			rendererOptions.alpha = true
			rendererOptions.clearColor = 0x000000
		}
		renderer = new THREE.WebGLRenderer(rendererOptions);
		if ( this.settings.shadows > 0 ) {
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		}
		postProcessing = new PostProcessing(renderer, scene, camera);
		if ( usePostProcessing )
			postProcessing.init()

		this.postProcessing = postProcessing
		this.socket = socket
		this.config = null
		this.windowFocus = true
		this.name = ""
		this.userName = "world"
		this.mode = "3d" // web, stereo ( IOTmode should be set this way )
		this.users = []
 		this.camera = camera
		this.skyboxMesh = false
		this.vrFrame = !!(window as any).VRFrameData ? new VRFrameData() : null
		this.sendUpdatePacket = 0
		this.capturing = false
		this.webcamImage = ""
		this.HMDMode = "standard" // "head-movement"
		this.vrHeight = 1.2
		this.screenResX = screenResX
		this.initRenderer( renderer, "viewport" );
		this.threeJsPluginLoader = new THREEJSPluginLoader(THREE);
		// this.octree = new THREE.Octree({
		// 	undeferred: false,
		// 	depthMax: Infinity,
		// 	// max number of objects before nodes split or merge
		// 	objectsThreshold: 8,
		// 	// percent between 0 and 1 that nodes will overlap each other
		// 	// helps insert objects that lie over more than one node
		// 	overlapPct: 0.15,
		// 	scene
		// });
		this.user.id = -Math.floor(Math.random()*1000000);
		// this.octree.visualMaterial.visible = false
		this.raycaster = new THREE.Raycaster()
		this.raycaster.near = 0.5
		this.THREE = THREE;
		(window as any).THREE = THREE;

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
		this.space = this.systems.space
		this.skybox = this.systems.skybox
		this.workers = {
			staticCollisions: this.systems.staticCollisions.worker,
			ecsWorker: this.systems.script.worker
			// oimo: this.systems.oimo.worker
		}
		camera.add(this.systems.audio.listener)
		// ^^^ have to get permission first now with new webaudio api

		this.socketHandlers = new SocketHandlers( this, socket )
		window.addEventListener('resize', e => this.onWindowResize(), true)
		this.onWindowResize();

		animate(this, 0, 0);
		this.animate = animate;

		(three as any).vrDisplay = null;
		(window.navigator as any).getVRDisplays().then( (displays: any[]) => { console.log( "displays", displays )
			if ( displays.length > 0 )
				(three as any).vrDisplay = displays[ 0 ]

		})
		this.initialLoad = false
		this.loadedCallback = () => {
			loadedCallback( this );
			 this.initialLoad = true;
		}
		window.onblur = () => {
			//this.props.setWindowFocus(false)
			this.windowFocus = false
		};
		window.onfocus = () => {
			this.windowFocus = true;
			this.user.velocity.y = 0;
			this.onFocusCallback();
		};
		window.addEventListener('vrdisplayactivate', function(e) {
			console.log('Display activated.', e);
			  (navigator as any).getVRDisplays().then( (displays: any[]) => { console.log("displays", displays)
				if ( displays.length > 0 ) {
				  console.log("vrdisplayactivate: found display: ", displays[0])
				  //three.vrDisplay = displays[0]
				  self.initiateVRMode()
				}
			  });
			
		  });
	  
		(document.querySelector("#viewport") as any).onclick = (event: any) => {
			let elem = event.target,
				uInput = self.userInput
			event.preventDefault()
			if (!uInput.fullscreen) {
			  self.mode = "3d"
			elem.requestPointerLock()
				self.clickCanvasCallback();
			}
		}
	}

	public startAnimation () { // for debugging
		this.animate(this, 0, 0)
	}

	public initChatAndLoggedInUser(doLogin = false) {
		this.initChatCallback();
		if ( doLogin ) {
			console.log("do login");
		  let rememberUser = localStorage.getItem("rememberUser"), // detect user credentials // refactor this...
		  username = '',
		  password = '',
		  autoSignIn = false
	
		  if (rememberUser != null) {
			username = localStorage.getItem("username") // refactor this to be more secure before beta 0.6
			password = localStorage.getItem("password")
			if (username != null && username != '') {
			  autoSignIn = true;
			  this.rememberUserCallback(username, password)
			}
		  }
		} else {
		  this.onUserLogin( world.user )
		}
	  }

	public initUserInput() {
		this.userInput.init( this, this.camera, this.user )
    	this.userInput.rotationVector = { x: 0, y: 2.5, z: 0 }
	}

	public initUserAvatar(newUser: any, callback: Function, overrideAvatar?: string) {
		let toolMenu:     Entity   = null,
			avatar = this.systems.assets.makeEntity(  
			overrideAvatar || newUser.data.avatar || "default-avatar", 
			true, 
			{ 
			  userId: newUser.id, 
			  userName: newUser.name,
			  wholeBody: false 
			}, 
			GLOBAL_SPACE 
		  ) as Entity; // entity id can be passed into config object
	  avatar.init( this.three.scene )
	  this.user.useAvatar( avatar );
	  this.initUserInput();
      this.user.toolbox = world.systems.toolbox
      toolMenu = this.systems.assets.makeEntity("tool-menu", true, {}, GLOBAL_SPACE) as Entity // method for spawning built in entities
      this.user.hud = toolMenu
      toolMenu.init( this.three.scene, {}, (menu: Entity) => { 
		  console.warn("Tool menu callback", menu)
        menu.componentsByAttr.toolUI[0].state.toolUI.updatePosition()
      }); 
	  callback && callback(avatar);
	}

	public init(config: SpaceConfig, callback: Function ) {
		console.log("init world")
		const sky = config.sky,
			terrainColor = [config.terrain.red, config.terrain.green, config.terrain.blue];

		let coords: any    = window.location.href.indexOf("/at/") > -1 ? window.location.href.split('/at/')[1] : false,
			skyLight 	   = this.skyLight 
				|| new THREE.HemisphereLight( 
					new THREE.Color().fromArray([sky.red, sky.green, sky.blue]), 
					new THREE.Color().fromArray(terrainColor), config.light.intensity * 0.6 ) /* new THREE.DirectionalLight( config.light.color, 0.4 )*/, 
			sunLight       = this.sunLight || //this.settings.shadows > 0 
				 new THREE.DirectionalLight( 0xfffff0, Math.min(1.0, config.light.intensity) ),
				// : new THREE.PointLight(0xffffff, config.light.intensity, 10000000),
			three          = this.three,
			camera 		   = three.camera,
			rotateSky      = false,
			envURL 	       = '/data/images/photospheres/sky-reflection.jpg',
			r 		       = config.sky.red,
			g 			   = config.sky.green,
			b 			   = config.sky.blue,
			oldConfig 	   = Object.assign({}, this.config),
			skySize 	   = 2800+((this.settings.viewDistance+3.5)*1.4)*140,
			oldSkyMaterial = {};

		this.skyLight = skyLight
		this.sunLight = sunLight
		this.skyLight.color.set( config.light.color )
		this.sunLight.intensity = config.light.intensity 

		this.config = config; console.info("Space config: ", config)
		this.space.initTerrain(config.terrain)
		this.ambientLight = this.ambientLight || new THREE.AmbientLight(config.light.ambientColor, 0.25)
		this.ambientLight.color.set( config.light.ambientColor )
		
		if ( this.settings.shadows > 0 && sunLight.castShadow == false ) {
			this.initShadows(sunLight);
		}

		if ( !!config && !!config.sky.photosphere ) { console.log("init world: photosphere: ", config.sky.photosphere)
			this.systems.assets.envMaps.default = '/data/user/'+config.sky.photosphere
			rotateSky = true
		} else {
			envURL = this.systems.assets.getEnvMapFromColor( r, g, b )
			this.systems.assets.envMaps.default = envURL
		}

		oldSkyMaterial = this.skyboxMesh.material
		if (this.skyboxMesh && this.skyboxMesh.parent) {
			three.scene.remove(this.skyboxMesh)
		}
		console.log("init create skybox")
		this.skyboxMesh = this.skybox.createSkybox( skySize, oldSkyMaterial )
		
		const addLightsCallback = () => {
			for (const light of [world.ambientLight, world.sunLight, world.skyLight]) {
				if ( !!!light.parent ) {
					world.skyboxMesh.add( light );
				} 
			};
		}
		let deferSpaceLoading = false,
			world = this,
			rebuildSpace = () => {
				let yaw = config.light.yaw - Math.PI / 2.0;

				//!!world.skyLight && three.scene.remove( world.skyLight )
				skyLight.position.set( 0, 0, 0 )
				sunLight.position.set( Math.sin(yaw)*2000, Math.sin(config.light.pitch)*2000, Math.cos(yaw)*2000)

				skyLight.lookAt(zeroZeroZero)
				sunLight.lookAt(zeroZeroZero)
				//sunLight.shadow.camera.lookAt(zeroZeroZero)

				world.skyboxMesh.position.set(camera.position.x, 0, camera.position.z)
				callback()
			}

		if ( config.sky.skyType == 'shader' || config.sky.skyType == 'standard' ) {
			this.skybox.loadShaderSky( config, oldConfig, world.skyboxMesh, ()=>{})
			addLightsCallback();
		} else {
			// load sky texture
			deferSpaceLoading = true
			this.skybox.loadTexturedSky( config.sky, this.skyboxMesh, skySize, ()=> {
				addLightsCallback();
				rebuildSpace();
			});
		}

		if ( coords ) {
			coords = coords.split(".")
			three.camera.position.fromArray([parseInt(coords[0])*GRID_SIZE[0], parseInt(coords[1])*GRID_SIZE[1], parseInt(coords[2])* GRID_SIZE[2] ])
			three.camera.updateMatrix();
		}

		document.title = config.name.toLowerCase() == 'overworld' && config.userName == APP_NAME.toLowerCase() ? APP_NAME : config.name // make "Convolvr" default configurable via admin settings
		false == deferSpaceLoading && rebuildSpace()
	}

	public load(userName: string, name: string, callback: Function, readyCallback: Function) { console.log("load world", userName, name)
		let world = this

		this.name = name;
		this.userName = userName;
		(this.systems.terrain as any).readyCallback = readyCallback

		axios.get(`${API_SERVER}/api/spaces/name/${name}`).then( (response: any) => { // fix this... needs userName now
			 this.init(response.data, ()=> { callback && callback(world) } )
		}).catch((response: any) => {
			console.log("Space Error", response)
		})
	}

	public reload(user: string, name: string, place: string, coords: Array<number>, noRedirect: boolean) {
		this.space.destroy()
		this.workers.staticCollisions.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		this.workers.ecsWorker.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		//this.workers.oimo.postMessage(JSON.stringify( { command: "clear", data: {}} ))
		// problem here
		console.info("reload ", this.skyboxMesh)
		this.skybox.destroy()
		this.load( user, name, () => {}, () => {} )

		if ( !!! noRedirect ) {

		}
			//TODO: re-implement this as a redux action the app component listens for
			// browserHistory.push("/"+(user||"convolvr")+"/"+name+(!!place ? `/${place}` : ''))
	}

	generateFullLOD( coords: string) {
		let voxel = (this.space as any).voxels[coords],
			scene = this.three.scene

		if ( voxel != null && voxel.cleanUp == false ) {
			voxel.entities.map( ( entity: Entity, i: number )=>{
				i > 2 && entity.init(scene)
			})
		}
	}

	public sendUserData() {
		let camera 	  = this.three.camera,
			mobile 	  = this.mobile,
			input 	  = this.userInput,
			image 	  = "",
			imageSize = [0, 0],
			userHands = !!world.user.toolbox ? world.user.toolbox.hands : [],
			hands: any[] = []

		if ( this.sendUpdatePacket == 12 ) // send image
	    	imageSize = this.sendVideoFrame()

	  	this.sendUpdatePacket += 1
	  	if ( this.sendUpdatePacket %((2+(2*this.mode.indexOf("stereo") > -1 ? 1 : 0))*(mobile ? 2 : 1)) == 0 ) { // send packets faster / slower for all vr / mobile combinations
			if ( input.trackedControls || input.leapMotion ) {
				userHands.forEach( (handComponent: Component) => {
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
					avatar: this.user.data && this.user.data.avatar ? this.user.data.avatar : "default-avatar",
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

	getVoxel ( position?: any ) {
		let pos = position || this.camera.position

		return [ Math.floor( pos.x / GRID_SIZE[ 0 ] ), 0, Math.floor( pos.z / GRID_SIZE[ 2 ] ) ]
	}

	onWindowResize () {
		let customDPI = this.settings.dpr,
			dpr = customDPI ? customDPI : window.devicePixelRatio,
			three = this.three,
			camera = three.camera;

		this.screenResX = dpr * window.innerWidth
		if ( this.mode != "stereo" ) {
			this.three.renderer.setSize(window.innerWidth * dpr, window.innerHeight * dpr)
			if ( this.postProcessing.enabled )
				this.postProcessing.onResize(window.innerWidth * dpr, window.innerHeight * dpr)

		}

		camera.aspect = innerWidth / innerHeight
		camera.updateProjectionMatrix()

		if ( this.IOTMode )
			animate( this, Date.now(), 0 )

	}

	public initiateVRMode (enable?: boolean ) {
		let three = this.three,
			renderer = three.renderer,
			ratio = window.devicePixelRatio || 1,
			camera = three.camera,
			scene = three.scene,
			world = three.world,
			controls = null,
			effect: any = null
	
			if (three.vrControls == null) {
			  (window as any).WebVRConfig = {
				MOUSE_KEYBOARD_CONTROLS_DISABLED: true,
				TOUCH_PANNER_DISABLED: true
			  }
			  controls = new THREE.VRControls(camera)
	
			  if (!three.world.mobile) {
				renderer.autoClear = false
			  }
	
			  effect = new THREE.VREffect(renderer, world.postProcessing)
			  effect.scale = 1
			  effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio)
			  three.vrEffect = effect
			  three.vrControls = controls
			  
			  function onResize() {
				let ratio = window.devicePixelRatio || 1
				effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio)
			  }
			  function onVRDisplayPresentChange(e: any) {
				console.log('onVRDisplayPresentChange', e);
				onResize();
			  }
			  // Resize the WebGL canvas when we resize and also when we change modes.
			  window.addEventListener('resize', onResize);
			  window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);
			  console.log("vrDisplay", three.vrDisplay)
			  renderer.domElement.setAttribute("class", "viewport") // clear blur effect
			  if (three.vrDisplay != null) {
				three.vrDisplay.requestPresent([{source: renderer.domElement}]).then( ()=> {
	
				  if ( world.manualLensDistance != 0 && three.vrDisplay.dpdb_) {
					setTimeout(()=>{
					  console.warn("Falling back to Convolvr lens distance settings: ", world.manualLensDistance)
					  three.vrDisplay.deviceInfo_.viewer.interLensDistance = world.manualLensDistance || 0.057 
					
					}, 400)
				  }
				  three.vrDisplay.requestAnimationFrame(()=> { // Request animation frame loop function
					vrAnimate( three.world, three.vrDisplay, Date.now(), [0,0,0], 0)
				  })
				}).catch( (err: any) => {
				  console.error( err )
				})
				
			  } else {
				alert("Connect VR Display and then reload page.")
			  }
		  }
		  
		  this.toggleVRButtonCallback();
		  //this.mode = this.mode != "stereo" ? "stereo" : "web"
		  this.onWindowResize()
	  }

	private initShadows(sunLight: PointLight | DirectionalLight) {
		if (!sunLight.castShadow) {
			sunLight.castShadow = true;
			(sunLight as any).shadowCameraVisible = true
			let shadowCam: any = sunLight.shadow.camera;
			sunLight.shadow.mapSize.width = this.mobile ? 256 : Math.pow( 2, 8+this.settings.shadows);
			sunLight.shadow.mapSize.height = this.mobile ? 256 : Math.pow( 2, 8+this.settings.shadows);
			shadowCam.near = 0.5      // default
			shadowCam.far = 1300000
			shadowCam.left = -400
			shadowCam.right = 400
			shadowCam.top = 500
			shadowCam.bottom = -500
			this.three.scene.add(shadowCam);	
		}
		if  ( !this.shadowHelper ) {
			this.shadowHelper = new THREE.CameraHelper( sunLight.shadow.camera );
			this.three.scene.add( this.shadowHelper );
		}
	}

	private initRenderer (renderer: any, id: string) {
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
