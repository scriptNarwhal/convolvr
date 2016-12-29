import axios from 'axios'
import Avatar from './avatar'
import Terrain from './terrain/terrain'
import WorldPhysics  from '../workers/world-physics'
import { render, toggleStereo } from './render'
import { API_SERVER } from '../config.js'
import Seed from '../seed'

export default class World {
	constructor(userInput = false, socket, store) {
		let pixelRatio = window.devicePixelRatio ? window.devicePixelRatio : 1,
				mobile = (window.innerWidth <= 640),
				scene = new THREE.Scene(),
				camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1000, 4500000 ),
				renderer = new THREE.WebGLRenderer({antialias: pixelRatio <= 1.5}),
				self = this,
				three = {}

		this.appStore = store
		this.socket = socket
		this.config = false
		this.name = "convolvr"
		this.mode = "vr"
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
		this.toggleStereo = toggleStereo
		this.userInput = userInput
		this.sendUpdatePacket = 0
		this.capturing = false
		this.webcamImage = ""
		this.HMDMode = "non standard" // "head-movement"

		renderer.setPixelRatio(pixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		document.body.appendChild( renderer.domElement )
		renderer.domElement.setAttribute("id", "viewport")
		renderer.setClearColor(0x3b3b3b);
		camera.position.set(85000, 5916.124890438994, 155000);

		userInput.init(this, camera, this.user);
		this.worldPhysics = new WorldPhysics();
		this.worldPhysics.init(self);
		this.seed = new Seed();
		this.terrain = new Terrain(this);
		this.workers = {
			physics: this.worldPhysics
		}
		three = this.three = {
			world: this,
			scene: scene,
			camera: camera,
			renderer: renderer
		};

		window.three = this.three;
		window.onresize = function () {
			if (three.world.mode != "stereo") {
				three.renderer.setSize(window.innerWidth, window.innerHeight);
			}
			three.camera.aspect = innerWidth / innerHeight;
			three.camera.updateProjectionMatrix();
		}

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
					user = this.users[entity.id]
					if (user == null) {
						user = this.users[entity.id] = {
							id: entity.id,
							avatar: new Avatar(),
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
		render(this, 0)
		this.terrain.bufferChunks(true, 0)
	}

	init (config) {
		console.log(config)
		let camera = three.camera,
				material = new THREE.MeshPhongMaterial( {color: 0xffffff} ),
				skyLight =  new THREE.PointLight(config.light.color, 0.5, 3200000),
				skyShaderMat = null

		this.config = config;
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
		this.skybox = new THREE.Mesh(new THREE.OctahedronGeometry(4400000, 4), skyShaderMat)
		this.skybox.add(skyLight)
		skyLight.position.set(0, 300000, 300000)
		three.scene.add(this.skybox)
		this.skybox.position.set(camera.position.x, 0, camera.position.z)
	}

	load (name) {
		this.name = name;
		axios.get(`${API_SERVER}/api/worlds/name/${name}`)
           .then(response => {
			 this.init(response.data)
          }).catch(response => {
             console.log("World Error", response)
          });
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

	loadInterior (name) {

	}

	enterInterior (name) {

	}
};
