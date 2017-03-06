import axios from 'axios'
import Avatar from './avatar'
import Entity from '../entities/entity'
import Terrain from './terrain/terrain'
import UserPhysics  from '../systems/user-physics'
import EntityPhysics from '../systems/entity-physics'
import { render, vrRender} from './render'
import PostProcessing from './post-processing'
import { API_SERVER } from '../config.js'
import { send } from '../network/socket'

let world = null

export default class World {
	constructor(user, userInput = false, socket, store) {
		let mobile = (window.innerWidth <= 720),
				scene = new THREE.Scene(),
				camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1000, 6000000 ),
				screenResX = window.devicePixelRatio * window.innerWidth,
				renderer = null,
				self = this,
				three = {},
				postProcessing = false


		this.mobile = mobile
		this.initLocalSettings()
		let rendererOptions = {antialias: this.aa != 'off' && this.enablePostProcessing != 'on'}
		if (this.enablePostProcessing == 'on') {
			rendererOptions.alpha = true
			rendererOptions.clearColor = 0x000000
		}
		renderer = new THREE.WebGLRenderer(rendererOptions)
		postProcessing = new PostProcessing(renderer, scene, camera)
		if (this.enablePostProcessing == 'on') {
			postProcessing.init()
		}
		this.postProcessing = postProcessing
		this.socket = socket
		this.config = false
		this.windowFocus = true
		this.name = "convolvr"
		this.mode = "web"
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
		this.vrHeight = 0
		this.screenResX = screenResX
		this.initRenderer(renderer, "viewport")
		this.octree = new THREE.Octree({
			// when undeferred = true, objects are inserted immediately
			// instead of being deferred until next octree.update() call
			// this may decrease performance as it forces a matrix update
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
		// userInput.init(this, camera, this.user)
		this.UserPhysics = new UserPhysics()
		this.EntityPhysics = new EntityPhysics()
		this.UserPhysics.init(self)
		this.EntityPhysics.init(self)
		this.terrain = new Terrain(this);
		this.workers = {
			physics: this.UserPhysics
		}
		three = this.three = {
			world: this,
			scene,
			camera,
			renderer,
			vrDisplay: null
		};
		world = this
		window.three = this.three

		this.textures = {}
		let gridTexture = this.textures.grid = THREE.ImageUtils.loadTexture('/images/textures/gplaypattern_@2X.png', false, () => {
			gridTexture.wrapS = gridTexture.wrapT = THREE.RepeatWrapping
			gridTexture.repeat.set(12, 12)
			gridTexture.anisotropy = renderer.getMaxAnisotropy()
				//skybox.material = new THREE.MeshBasicMaterial({map: skyTexture, side:1, fog: false})
		})
		function onResize () {
			world.screenResX = window.devicePixelRatio * window.innerWidth
			if (three.world.mode != "stereo") {
				three.renderer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
			}
			if (world.postProcessing.enabled) {
				world.postProcessing.onResize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio)
			}
			three.camera.aspect = innerWidth / innerHeight
			three.camera.updateProjectionMatrix()
		}
		window.addEventListener('resize', onResize, true)
		this.onWindowResize = onResize
		onResize()

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
							avatar: new Avatar(entity.id, true, {}), // render whole body, not just hands
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
					chunk = world.terrain.voxels[coords[0]+".0."+coords[2]],
					quat = data.quaternion

			switch (data.tool) {
				case "Entity Tool":
					let ent = data.entity,
							entity = new Entity(ent.id, ent.components, data.position, data.quaternion)
					chunk.entities.push(entity)
					entity.init(three.scene)
				break;
				case "Component Tool":
					chunk.entities.map(voxelEnt => { // find & re-init entity
						if (voxelEnt.id == data.entityId) {
							console.log("got component tool message") // concat with existing components array
							console.log(data.entity.components)
							voxelEnt.components = voxelEnt.components.concat(data.entity.components)
							voxelEnt.init(three.scene)
						}
					})
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

		three.vrDisplay = null
		navigator.getVRDisplays().then(function(displays) {
			console.log("displays", displays)
		  if (displays.length > 0) {
		    three.vrDisplay = displays[0]
		  }
		})
	}

	init (config) {
		console.log(config)
		let camera = three.camera,
				skyLight =  new THREE.PointLight(config.light.color, 0.95, 5200000),
				skyMaterial = null,
				skybox = null

		this.config = config;
		this.terrain.init(config.terrain)
		this.ambientLight = new THREE.AmbientLight(config.light.ambientColor);
		three.scene.add(this.ambientLight);
		if (config.sky.skyType == 'shader' || config.sky.skyType == 'standard') {
			skyMaterial = new THREE.ShaderMaterial({
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
			})
		} else {
			// load sky texture
			skyMaterial = new THREE.MeshBasicMaterial({color:0x303030})
			let skyTexture = THREE.ImageUtils.loadTexture('/data/'+this.config.sky.photosphere, false, function() {
				 	skyTexture.magFilter = THREE.LinearFilter
	 				skybox.material = new THREE.MeshBasicMaterial({map: skyTexture, side:1, fog: false})
			})
		}
		skybox = this.skybox = new THREE.Mesh(new THREE.OctahedronGeometry(6000000, 4), skyMaterial)
		this.skyLight = skyLight
		three.scene.add(skyLight)
		three.scene.add(this.skybox)
		this.skybox.position.set(camera.position.x, 0, camera.position.z)
		skyLight.position.set(0, 1000000, 500000)
		this.terrain.bufferChunks(true, 0)
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
	initLocalSettings () {
		let cameraMode = localStorage.getItem("camera"),
				lighting = localStorage.getItem("lighting"),
				enablePostProcessing = localStorage.getItem("postProcessing"),
				aa = localStorage.getItem("aa")

		if (cameraMode == undefined) {
			cameraMode = 'fps'
			localStorage.setItem("camera", 'fps')
		}
		if (aa == undefined) {
			aa = 'on'
			localStorage.setItem("aa", aa)
		}
		if (lighting == undefined) {
			lighting = 'high'
			localStorage.setItem("lighting", !this.mobile ? 'high' : 'low')
		}
		if (enablePostProcessing == null) {
			enablePostProcessing = !this.mobile ? 'on' : 'off'
			localStorage.setItem("postProcessing", enablePostProcessing)
		}
		this.aa = aa
		this.cameraMode = cameraMode
		this.lighting = lighting
		this.enablePostProcessing = enablePostProcessing
	}
	load (name, callback) {
		this.name = name;
		axios.get(`${API_SERVER}/api/worlds/name/${name}`).then(response => {
			 this.init(response.data)
			 callback && callback(this)
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
		if (!!this.terrain.mesh) {
			three.scene.remove(this.terrain.mesh)
		}
		this.terrain.platforms.map(p => {
			if (p.mesh) {
				three.scene.remove(p.mesh)
			}
		})
		this.terrain.platforms = []
		this.terrain.voxels = []
		this.load(name)
	}

	generateFullLOD (coords) {
			let platform = this.terrain.voxels[coords]
			if (platform != null) {
				if (platform.structures != null) {
					platform.structures.forEach(structure =>{
							structure.generateFullLOD()
					})
				}
			}
	}

	sendUserData () {
		let camera = three.camera,
				mobile = this.mobile,
	      image = "",
	      imageSize = [0, 0],
	      userHands = world.user.hands,
	      hands = []

		if (this.sendUpdatePacket == 12) { // send image
	    imageSize = this.sendVideoFrame()
	  }
	  this.sendUpdatePacket += 1
	  if (this.sendUpdatePacket %((2+(1*this.mode == "stereo"))*(mobile ? 2 : 1)) == 0) {
	    if (this.userInput.leapMotion) {
	      userHands.forEach(function (arm) {
	        hands.push({pos: [arm.position.x, arm.position.y, arm.position.z],
	          quat: [arm.quaternion.x, arm.quaternion.y, arm.quaternion.z, arm.quaternion.w] });
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
	      if (this.capturing) {
	          this.webcamImage = ""
	      }
	    }
	}

	sendVideoFrame () {
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
				this.skyLight.position.set(camera.position.x, camera.position.y+1000000, camera.position.z+500000)
			}
    }
		if (terrainMesh) {
			terrainMesh.position.x = camera.position.x
			terrainMesh.position.z = camera.position.z
		}
	}

	loadInterior (name) {

	}

	enterInterior (name) {

	}
};
