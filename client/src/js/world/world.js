import axios from 'axios'
import Avatar from './avatar'
import Entity from './entities/entity'
import Terrain from './terrain/terrain'
import WorldPhysics  from '../workers/world-physics'
import { render, vrRender} from './render'
import { API_SERVER } from '../config.js'
import Seed from '../seed'

let world = null

export default class World {
	constructor(userInput = false, socket, store) {
		let mobile = (window.innerWidth <= 640),
				scene = new THREE.Scene(),
				camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1000, 6000000 ),
				screenResX = window.devicePixelRatio * window.innerWidth,
				rendererAA = new THREE.WebGLRenderer({antialias: true}),
				renderer = screenResX < 1900 ? new THREE.WebGLRenderer({antialias: false}) : null,
				self = this,
				three = {}

		this.appStore = store
		this.socket = socket
		this.config = false
		this.windowFocus = true
		this.name = "convolvr"
		this.mode = "web"
		this.rPos = false
		this.users = []
		this.user = {
			id: 0,
			username: "user"+Math.floor(1000000*Math.random()),
			toolbox: null,
			hud: null,
			cursor: null,
			arms: [],
			gravity: 1,
			velocity: new THREE.Vector3(),
			falling: false
		}
		this.camera = camera
		this.mobile = mobile
		this.userInput = userInput
		this.sendUpdatePacket = 0
		this.capturing = false
		this.webcamImage = ""
		this.HMDMode = "standard" // "head-movement"
		this.screenResX = screenResX
		this.initRenderer(rendererAA, "viewportAA")
		if (!!renderer) {
			this.initRenderer(renderer, "viewport")
		}
		this.raycaster = new THREE.Raycaster()
		userInput.init(this, camera, this.user)
		this.worldPhysics = new WorldPhysics()
		this.worldPhysics.init(self)
		this.seed = new Seed();
		this.terrain = new Terrain(this);
		this.workers = {
			physics: this.worldPhysics
		}
		three = this.three = {
			world: this,
			scene,
			camera,
			renderer,
			rendererAA,
			vrDisplay: null
		};
		world = this
		window.three = this.three;
		window.onresize = function () {
			world.screenResX = window.devicePixelRatio * window.innerWidth
			if (three.world.mode != "stereo") {
				three.renderer && three.renderer.setSize(window.innerWidth, window.innerHeight)
				three.rendererAA.setSize(window.innerWidth, window.innerHeight)
				let viewport = document.querySelector("#viewport"),
						viewportAA = document.querySelector("#viewportAA")
				if (viewport) {
					if (world.screenResX > 1900) {
						viewport.style.visibility = 'hidden'
						viewportAA.style.visibility = ''
					} else {
						viewport.style.visibility = ''
						viewportAA.style.visibility = 'hidden'
					}
				}
			}
			three.camera.aspect = innerWidth / innerHeight
			three.camera.updateProjectionMatrix()
		}
		window.onresize()

		socket.on("update", packet => {
			let data = JSON.parse(packet.data),
				entity = null,
				user = null,
				pos = null,
				quat = null,
				mesh = null

			if (!! data.entity) {
				entity = data.entity
				if (entity.id != this.user.id) {
					pos = entity.position
					quat = entity.quaternion
					user = this.users["user"+entity.id]
					if (user == null) {
						user = this.users["user"+entity.id] = {
							id: entity.id,
							avatar: new Avatar(entity.id, "standard", {}),
							mesh: null
						}
					}
					user.mesh = user.avatar.mesh;
					mesh = user.mesh
					if (!! mesh) {
						mesh.position.set(pos.x, pos.y, pos.z)
						mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w)
					}
				}
			}
		})
		socket.on("tool action", packet => {
			let data = JSON.parse(packet.data),
					user = world.user,
					pos = data.position,
					coords = data.coords,
					chunk = world.terrain.pMap[coords[0]+".0."+coords[2]],
					quat = data.quaternion

			switch (data.tool) {
				case "Entity Tool":
					let ent = data.entity,
							entity = new Entity(ent.id, ent.components, ent.aspects, data.position, data.quaternion, ent.translateZ)
					entity.init(chunk.mesh)
				break;
				case "Component Tool":

				break;
				case "Voxel Tool":

				break;
				case "Projectile Tool":

				break;
				case "Delete Tool":

				break;
			}
		})
		render(this, 0)
		this.terrain.bufferChunks(true, 0)

		three.vrDisplay = null
		navigator.getVRDisplays().then(function(displays) {
			console.log("displays", displays)
		  if (displays.length > 0) {
		    three.vrDisplay = displays[0];
		    //vrDisplay.requestAnimationFrame(vrRender)
		  }
		})
	}

	init (config) {
		console.log(config)
		let camera = three.camera,
				skyLight =  new THREE.PointLight(config.light.color, 0.5, 3200000),
				skyShaderMat = null

		this.config = config;
		this.terrain.init(config.terrain)
		this.ambientLight = new THREE.AmbientLight(config.light.ambientColor);
		three.scene.add(this.ambientLight);
		skyShaderMat = new THREE.ShaderMaterial( {
			side: 1,
			fog: false,
			uniforms: {
				time: { type: "f", value: 1.0 },
				red: { type: "f", value: config.sky.red },
				green: { type: "f", value: config.sky.green },
				blue: { type: "f", value: config.sky.blue }
			},
			vertexShader: document.getElementById('sky-vertex').textContent,
			fragmentShader: document.getElementById('sky-fragment').textContent

		} )

		three.skyMat = skyShaderMat
		this.ground = new THREE.Object3D()
		this.ground.rotation.x = -Math.PI /2
		this.skybox = new THREE.Mesh(new THREE.OctahedronGeometry(6000000, 4), skyShaderMat)
		this.skyLight = skyLight
		this.skybox.add(skyLight)
		skyLight.position.set(0, 300000, 300000)
		three.scene.add(this.skybox)
		this.skybox.position.set(camera.position.x, 0, camera.position.z)
	}

	initRenderer (renderer, id) {
		let pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1
		renderer.setClearColor(0x3b3b3b)
		renderer.setPixelRatio(pixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
			document.body.appendChild( renderer.domElement )
			renderer.domElement.setAttribute("class", "viewport")
			renderer.domElement.setAttribute("id", id)
	}

	load (name) {
		this.name = name;
		axios.get(`${API_SERVER}/api/worlds/name/${name}`).then(response => {
			 this.init(response.data)
    }).catch(response => {
        console.log("World Error", response)
    });
	}

	reload (name) {
		if (!!this.skyLight) {
			three.scene.remove(this.skyLight)
		}
		if (!!this.skybox) {
			three.scene.remove(this.skybox)
		}
		if (!!this.ground) {
			three.scene.remove(this.ground)
		}
		this.terrain.platforms.map(p => {
			if (p.mesh) {
				three.scene.remove(p.mesh)
			}
		})
		this.terrain.platforms = []
		this.terrain.pMap = []
		this.load(name)
	}

	generateFullLOD (coords) {
			let platform = this.terrain.pMap[coords]
			if (platform != null) {
				if (platform.structures != null) {
					platform.structures.forEach(structure =>{
							structure.generateFullLOD()
					})
				}
			}
	}

	sendVideoFrame () {
		if (this.capturing) {
		 var v = document.getElementById('webcam'),
				 canvas = document.getElementById('webcam-canvas'),
				 context = canvas.getContext('2d'),
				 cw = Math.floor(v.videoWidth),
				 ch = Math.floor(v.videoHeight),
				 imageSize = [cw, ch];

		 canvas.width = 320;
		 canvas.height = 240;
		 context.drawImage(v, 0, 0, 320, 240);
		 this.webcamImage = canvas.toDataURL("image/jpg", 0.6);
	 }
	 this.sendUpdatePacket = 0;
	}

	loadInterior (name) {

	}

	enterInterior (name) {

	}
};
