import Avatar from './avatar'
import Terrain from './terrain'
import WorldPhysics  from '../workers/world-physics'
import Seed from '../seed'
import { send } from '../network/socket'

export default class World {
	constructor(userInput = false, socket, store) {

		var scene = new THREE.Scene(),
			camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1000, 4500000 ),
			renderer = new THREE.WebGLRenderer({antialias: true}),
			mobile = (window.innerWidth <= 640),
			self = this,
			coreGeom = new THREE.CylinderGeometry(8096, 8096, 1024, 9),
			material = new THREE.MeshPhongMaterial( {color: 0xffffff} ),
			core = new THREE.Mesh(coreGeom, material),
			skyLight =  new THREE.PointLight(0x6000ff, 0.5, 3000000),
			skyShaderMat = null,
			three = {},
			x = 0,
			y = 0,
			r = 4000;

		this.appStore = store;
		this.socket = socket;
		this.mode = "vr";
		this.users = [];
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
		this.camera = camera;
		this.mobile = mobile;
		this.userInput = userInput;
		this.sendUpdatePacket = 0;
		this.capturing = false;
		this.webcamImage = "";
		this.HMDMode = "non standard"; // "head-movement"
		this.ambientLight = new THREE.AmbientLight(0x090037);
		scene.add(this.ambientLight);
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild( renderer.domElement );
		renderer.domElement.setAttribute("id", "viewport");
		renderer.setClearColor(0x3b3b3b);
		camera.position.set(85000, 5916.124890438994, 155000);

		skyShaderMat = new THREE.ShaderMaterial( {
			side: 1,
			fog: false,
			uniforms: {
				time: { type: "f", value: 1.0 }
			},
			vertexShader: document.getElementById('sky-vertex').textContent,
			fragmentShader: document.getElementById('sky-fragment').textContent

		} );

		this.ground = new THREE.Object3D();
		this.ground.rotation.x = -Math.PI /2;
		this.skybox = new THREE.Mesh(new THREE.OctahedronGeometry(4400000, 4), skyShaderMat);
		this.skybox.add(skyLight);
		skyLight.position.set(0, 300000, 300000);
		scene.add(core);
		core.position.set(0, 2000, 0);
		scene.add(this.skybox);
		this.skybox.position.set(camera.position.x, 0, camera.position.z);
		userInput.init(this, camera, this.user);
		this.worldPhysics = new WorldPhysics();
		this.worldPhysics.init(self);
		this.seed = new Seed();
		this.terrain = new Terrain(this);

		this.workers = {
			physics: this.worldPhysics
			// npc: this.npcLogic.worker
		}

		three = this.three = {
			world: this,
			skyMat: skyShaderMat,
			core: core,
			scene: scene,
			camera: camera,
			renderer: renderer
		};
		window.three = this.three;
		this.render(0);

		window.onresize = function () {
			if (three.world.mode != "stereo") {
				three.renderer.setSize(window.innerWidth, window.innerHeight);
			}
			three.camera.aspect = innerWidth / innerHeight;
			three.camera.updateProjectionMatrix();
		}

		this.terrain.bufferPlatforms(true, 0);

	}

	render (last) {
		var core = this.three.core,
			mobile = this.mobile,
			camera = three.camera,
			cPos = camera.position,
			delta = ((Date.now() - last) / 10000.0),
			time = (Date.now() / 4600),
			image = "",
			imageSize = [0, 0],
			beforeHMD = [0, 0, 0],
			beforeInput = [0, 0, 0],
			userArms = this.user.arms,
			arms = [];

		if (!! this.userInput) {
			this.userInput.update(delta);
			// Update VR headset position and apply to camera.
			if(!! three.vrControls) {
				beforeHMD = [camera.position.x, camera.position.y, camera.position.z];
				three.vrControls.update();
				camera.position.multiplyScalar(12000);

			}

			if (this.mode == "stereo") {
				if (this.HMDMode == "standard") {
					camera.position.set(/*beforeHMD[0] + */ cPos.x / 2.0,
															/*beforeHMD[1] + */ cPos.y / 2.0,
															/*beforeHMD[2] + */ cPos.z / 2.0);
				} else {
					camera.position.set(beforeHMD[0] + cPos.x / 2.0,
															beforeHMD[1] + cPos.y / 2.0,
															beforeHMD[2] + cPos.z / 2.0);
				}

			}
		}
		if (this.user && this.user.mesh) {
			this.user.mesh.position.set(cPos.x, cPos.y, cPos.z);
			this.user.mesh.quaternion.set(camera.quaternion.x, camera.quaternion.y, camera.quaternion.z, camera.quaternion.w);
		}
		if (this.sendUpdatePacket == 12) { // send image
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
		this.skybox.material.uniforms.time.value += delta;
		this.sendUpdatePacket += 1;
		if (this.sendUpdatePacket %((2+(1*this.mode == "stereo"))*(mobile ? 2 : 1)) == 0) {

			if (this.userInput.leapMotion) {
				userArms.forEach(function (arm) {
					arms.push({pos: [arm.position.x, arm.position.y, arm.position.z],
						quat: [arm.quaternion.x, arm.quaternion.y, arm.quaternion.z, arm.quaternion.w] });
					});
				}

				send('update', {
					entity: {
						id: this.user.id,
						username: this.user.username,
						image: this.webcamImage,
						imageSize: imageSize,
						arms: arms,
						position: {x:camera.position.x, y:camera.position.y, z: camera.position.z},
						quaternion: {x: camera.quaternion.x, y: camera.quaternion.y, z: camera.quaternion.z, w:camera.quaternion.w}
					}
				});

					if (this.capturing) {
						this.webcamImage = "";
					}
				}

				core.rotation.y += 0.005;
				this.skybox.material.uniforms.time.value += delta;
				this.skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
				this.ground.position.set(camera.position.x, camera.position.y - 2000, camera.position.z);
				if (this.mode == "vr" || this.mode == "desktop") {
					// render for desktop / mobile (without cardboard)
					this.three.renderer.render(three.scene, camera);
				} else if (this.mode == "stereo") {
					// Render the scene in stereo for HMD.
				 	!!three.vrEffect && three.vrEffect.render(three.scene, camera);
				}
				last = Date.now();
				requestAnimationFrame( () => { this.render(last) } )
		}

		toggleStereo (mode) {
			let renderer = three.renderer,
				camera = three.camera,
				controls = null,
				effect = null;

				if (mode == "stereo") {
					if (three.vrControls == null) {
						window.WebVRConfig = {
              MOUSE_KEYBOARD_CONTROLS_DISABLED: true
            };
						controls = new THREE.VRControls(camera);
						effect = new THREE.VREffect(renderer);
						let ratio = window.devicePixelRatio || 1;
						effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio);
						three.vrEffect = effect;
						three.vrControls = controls;
						// Get the VRDisplay and save it for later.
						var vrDisplay = null;
						navigator.getVRDisplays().then(function(displays) {
						  if (displays.length > 0) {
						    vrDisplay = displays[0];
						  }
						});

						function onResize() {
							let ratio = window.devicePixelRatio || 1;
						  effect.setSize(window.innerWidth * ratio, window.innerHeight * ratio);
						}
						function onVRDisplayPresentChange() {
						  console.log('onVRDisplayPresentChange');
						  onResize();
						}
						// Resize the WebGL canvas when we resize and also when we change modes.
						window.addEventListener('resize', onResize);
						window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);

						setTimeout(()=> {
							if (vrDisplay) {
								vrDisplay.requestPresent([{source: renderer.domElement}]);
							} else {
								alert("Connect VR Display and then reload page.")
							}
						}, 1000)

						// document.querySelector('#viewport').addEventListener('click', function() {
						//   vrDisplay.requestPresent([{source: renderer.domElement}]);
						// });
						// document.querySelector('button#reset').addEventListener('click', function() {
						//   vrDisplay.resetPose();
						// });
					}
				}
				window.onresize();
		}

		generateFullLOD (coords) {
			let platform = this.terrain.pMap[coords];
			if (platform != null) {
				if (platform.structures != null) {
					platform.structures.forEach(structure =>{
							structure.generateFullLOD();
					})
				}
			}
		}

			loadInterior (name) {

			}
			enterInterior (name) {

			}
	};
