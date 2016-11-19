import Avatar from './avatar.js';
import Platform from './platform.js';
import WorldPhysics  from '../workers/world-physics.js';
import {on,send,sendReceive} from '../network/socket'

export default class World {
	constructor(userInput = false) {

		var scene = new THREE.Scene(),
			camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1000, 4500000 ),
			renderer = new THREE.WebGLRenderer({antialias: true}),
			mobile = (window.innerWidth <= 640),
			self = this,
			coreGeom = new THREE.CylinderGeometry(8096, 8096, 1024, 9),
			material = new THREE.MeshPhongMaterial( {color: 0xffffff} ),
			core = new THREE.Mesh(coreGeom, material),
			light = new THREE.PointLight(0xffffff, 1.5, 50000000),
			skyShaderMat = null,
			three = {},
			x = 0,
			y = 0,
			r = 4000;

		this.mode = "vr";
		this.users = [];
		this.user = {
			username: "user"+Math.floor(1000000*Math.random()),
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
		this.platforms = [];
		this.pMap = []; // map of coord strings to platforms
		this.lastChunkCoords = [0, 0, 0];
		this.chunkCoords = [0, 0, 0];
		this.cleanUpPlatforms = [];


		scene.fog = new THREE.FogExp2(0x333333, 0.00000015);
		this.ambientLight = new THREE.AmbientLight(0x050505);
		scene.add(this.ambientLight);
		// light.position.set(0, 60000, -32000);
		renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild( renderer.domElement );
		renderer.domElement.setAttribute("id", "viewport");
		renderer.setClearColor(0x150840);

		//camera.position.set(-18391.370770019803, 5916.124890438994, -14620.440770421374);
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
		this.skybox.add(light);
		scene.add(core);
		core.position.set(0, 2000, 0);
		light.position.set(30000000, 7500000, 0);
		scene.add(this.skybox);
		this.skybox.position.set(camera.position.x, 0, camera.position.z);

		userInput.init(this, camera, this.user);
		this.worldPhysics = new WorldPhysics();
		this.worldPhysics.init(self);

		this.workers = {
			physics: this.worldPhysics
			// npc: this.npcLogic.worker
		}

		three = this.three = {
			world: this,
			skyMat: skyShaderMat,
			core: core,
			scene: scene,
			chunks: [],
			camera: camera,
			renderer: renderer
		};
		window.three = this.three;
		console.log("window.three");
		console.log(window.three);
		this.render(0);

		window.onresize = function () {
			if (three.world.mode != "stereo") {
				three.renderer.setSize(window.innerWidth, window.innerHeight);
			}
			three.camera.aspect = innerWidth / innerHeight;
			three.camera.updateProjectionMatrix();
		}

		setTimeout(() => {

			sendReceive("/user/create", {
				username: "Foo",
				email: "foo@foo.com",
				password: "abcdfooZ",
			}, res => {
				console.log("Create User!", res)
			})

			sendReceive("/user/create", {
				username: "Foo2",
				email: "foo2@foo.com",
				password: "abcdfooZ",
			}, res => {
				console.log("Create User!", res)
			})

			sendReceive("/user/create", {
				username: "Foo3",
				email: "foo3@foo.com",
				password: "abcdfooZ",
			}, res => {
				console.log("Create User!", res)
			})
		}, 5000)

		on("/update", data => {
			let entity = null,
				user = null,
				pos = null,
				quat = null,
				mesh = null;

			if (!! data.entity) {
				entity = data.entity;
				pos = entity.pos;
				quat = entity.quat;
				user = self.users[entity.id];
				if (user == null) {
					user = self.users[entity.id] = {
						id: entity.id,
						avatar: new Avatar()
					}
				}
				mesh = user.mesh;
			}
			if (!! mesh) {
				mesh.position.set(pos.x, pos.y, pos.z);
				mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w);
			}
		})

		this.bufferPlatforms(true, 0);

	}

	render (last) {
		var sys = this,
			core = sys.three.core,
			mobile = sys.mobile,
			camera = sys.three.camera,
			delta = ((Date.now() - last) / 10000.0),
			time = (Date.now() / 4600),
			image = "",
			imageSize = [0, 0],
			beforeHMD = [0, 0, 0],
			beforeInput = [0, 0, 0],
			userArms = sys.user.arms,
			arms = [];

			// Update VR headset position and apply to camera.
			if(!! three.vrControls) {
				beforeHMD = [camera.position.x, camera.position.y, camera.position.z];
				three.vrControls.update();
				camera.position.multiplyScalar(12000);

			}

		if (!! sys.userInput) {
			sys.userInput.update(delta);

			if (sys.mode == "stereo") {
				camera.position.set(beforeHMD[0] + camera.position.x / 2.0,
														beforeHMD[1] + camera.position.y / 2.0,
														beforeHMD[2] + camera.position.z / 2.0);
			}
		}
		if (sys.sendUpdatePacket == 12) { // send image
			if (sys.capturing) {
				var v = document.getElementById('webcam'),
				 	canvas = document.getElementById('webcam-canvas'),
				 	context = canvas.getContext('2d'),
				 	cw = Math.floor(v.videoWidth),
				 	ch = Math.floor(v.videoHeight),
					imageSize = [cw, ch];

				canvas.width = 320;
				canvas.height = 240;
				context.drawImage(v, 0, 0, 320, 240);
				sys.webcamImage = canvas.toDataURL("image/jpg", 0.6);
			}
			sys.sendUpdatePacket = 0;
		}
		sys.skybox.material.uniforms.time.value += delta;
		sys.sendUpdatePacket += 1;
		if (sys.sendUpdatePacket %(2*(mobile ? 2 : 1)) == 0 && (sys.mode == "vr" || sys.mode == "stereo")) {

			if (sys.userInput.leapMotion) {
				userArms.forEach(function (arm) {
					arms.push({pos: [arm.position.x, arm.position.y, arm.position.z],
						quat: [arm.quaternion.x, arm.quaternion.y, arm.quaternion.z, arm.quaternion.w] });
					});
				}
				/*send('/update', { // temporarily disabled
					username: sys.user.username,
					image: sys.webcamImage,
					imageSize: imageSize,
					arms: arms,
					position: {x:camera.position.x, y:camera.position.y, z: camera.position.z},
					quaternion: {x: camera.quaternion.x, y: camera.quaternion.y, z: camera.quaternion.z, w:camera.quaternion.w}
				});*/
					if (sys.capturing) {
						sys.webcamImage = "";
					}
				}

				core.rotation.y += 0.005;
				sys.skybox.material.uniforms.time.value += delta;
				sys.skybox.position.set(camera.position.x, camera.position.y, camera.position.z);
				sys.ground.position.set(camera.position.x, camera.position.y - 2000, camera.position.z);
				if (sys.mode == "vr" || sys.mode == "desktop") {
					// render for desktop / mobile (without cardboard)
					sys.three.renderer.render(three.scene, camera);
				} else if (sys.mode == "stereo") {
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
						effect.setSize(window.innerWidth, window.innerHeight);
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
						  effect.setSize(window.innerWidth, window.innerHeight);
						}
						function onVRDisplayPresentChange() {
						  console.log('onVRDisplayPresentChange');
						  onResize();
						}
						// Resize the WebGL canvas when we resize and also when we change modes.
						window.addEventListener('resize', onResize);
						window.addEventListener('vrdisplaypresentchange', onVRDisplayPresentChange);

						// Button click handlers.
						// document.querySelector('button#fullscreen').addEventListener('click', function() {
						//   three.world.userInput.toggleFullscreen(renderer.domElement);
						// });

						setTimeout(()=> {
							vrDisplay.requestPresent([{source: renderer.domElement}]);
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

		makeVoxels (t) {
			let voxels = [],
				y = 11,
				x = 15;

			switch(t) {
				case 0:
					for (x = 8; x >= 0; x--) {
						if (Math.random() < 0.1) {
							voxels.push({
								cell: [
									x, 2+Math.floor(2*Math.sin(x/2.0)), x % 6
								]
							})
						}
					}
				break
				case 1:
					for (x = 15; x >= 0; x--) {
						for (y = 8; y >= 0; y--) {
							if (Math.random() < 0.2) {
								voxels.push({
									cell: [
										x, 2+Math.floor(Math.sin(x)*Math.cos(y/2.0)), y
									]
								})
							}
						}
					}
				break;
				case 2:
				for (x = 8; x >= 0; x--) {
					for (y = 11; y >= 0; y--) {
						if (Math.random() < 0.4) {
							voxels.push({
								cell: [
									x-y, 2+y%4, y+x
								]
							})
						}
					}
				}
				break;
				case 3:
				for (x = 15; x >= 0; x--) {
					for (y = 11; y >= 0; y--) {
						if (Math.random() < 0.75) {
							voxels.push({
								cell: [
									x, 1+y%6, y
								]
							})
						}
					}
				}
				break;
				case 4:
				for (x = 15; x >= 0; x--) {
					for (y = 11; y >= 0; y--) {
						if (Math.random() < 0.25) {
							voxels.push({
								cell: [
									x, 2+Math.floor(2*Math.sin(x/1.5)+2*Math.cos(y/1.5)), y
								]
							})
						}
					}
				}
				break;
			}
			return voxels;
		}
		bufferPlatforms (force, phase) {
			let platforms = this.platforms,
				plat = null,
				physicalPlatforms = [],
				removePhysicsChunks = [],
				chunkPos = [],
				pCell = [0,0,0],
				pMap = this.pMap,
				position = three.camera.position,
				platform = null,
				physicalPlat = null,
				c = 0,
				coords = [Math.floor(position.x/232000), 0, Math.floor(position.z/201840)],
				lastCoords = this.lastChunkCoords,
				moveDir = [coords[0]-lastCoords[0], coords[2] - lastCoords[2]],
				viewDistance = (this.mobile ? 6 : (window.innerWidth > 2100 ?  12  : 10)),
				removeDistance = viewDistance + 2,
				endCoords = [coords[0]+viewDistance, coords[2]+viewDistance],
				x = coords[0]-phase,
				y = coords[2]-phase;
				this.chunkCoords = coords;

			if (force || coords[0] != lastCoords[0] || coords[1] != lastCoords[1] || coords[2] != lastCoords[2]) {
				lastCoords = this.lastChunkCoords = [coords[0], coords[1], coords[2]];
				force = false; 	// remove old chunks
				for (c in platforms) {
						platform = platforms[c];
						pCell = platform.data.cell;
						if (!!!platform.cleanUp && (pCell[0] < coords[0] - removeDistance ||
																				pCell[0] > coords[0] + removeDistance ||
																				pCell[2] < coords[2] - removeDistance ||
																				pCell[2] > coords[2] + removeDistance)
							) { 	// park platforms for removal
								platform.cleanUp = true;
								this.cleanUpPlatforms.push({physics: {cell: [pCell[0], 0, pCell[2]]}, cell: pCell[0]+".0."+pCell[2]});
							}
					}
				}
					c = 0;
					let cleanUpPlats = this.cleanUpPlatforms;
					this.cleanUpPlatforms.forEach(function (plat, i) {
						if (c < 4) {
							if (!!plat) {
								physicalPlat = pMap[plat.cell];
								!! physicalPlat && !! physicalPlat.mesh && three.scene.remove(physicalPlat.mesh);
								removePhysicsChunks.push(plat.physics);
								platforms.splice(platforms.indexOf(physicalPlat), 1);
								delete pMap[plat.cell];
								cleanUpPlats.splice(i, 1);
							}
							c ++;
						}
					})


					c = 0;
					// load new platforms // at first just from client-side generation
					while (x <= endCoords[0]) {
						while (y <= endCoords[1]) {
							//console.log("checking", x, y);
							if (c < 2 && pMap[x+".0."+y] == null) { // only if its not already loaded
								c ++;
								if (Math.random() < 0.5 ) {
									let voxels = [];
									if (Math.random() < 0.44) {
										voxels = this.makeVoxels( Math.floor(Math.random() * 5) );
									}
									platform = new Platform({voxels: voxels, structures: Math.random() < 0.33 ? [
										{
											length: 1+Math.floor(Math.random()*4.0),
											width: 1+Math.floor(Math.random()*4.0),
											floors: 2+Math.floor(Math.random()*6.0),
											position: [-1.0, 0, -1.0]
										}
								] : undefined}, [x, 0, y]);
									three.scene.add(platform.mesh);
									physicalPlatforms.push(platform.data);
								} else {
									platform = { data: {
										 cell: [x, 0, y]
									}};
								}

								platforms.push(platform);
								pMap[x+".0."+y] = platform;
							}
							y += 1;
						}
						y = coords[2]-viewDistance;
						x += 1;
					}

				//}

				if (physicalPlatforms.length > 0) {
					this.worldPhysics.worker.postMessage(JSON.stringify({
				        command: "add platforms",
				        data: physicalPlatforms
				    }))
				}
				if (removePhysicsChunks.length > 0) {
					this.worldPhysics.worker.postMessage('{"command":"remove platforms","data":'+JSON.stringify(removePhysicsChunks)+'}');
				}

				lastCoords[0] = coords[0];
				lastCoords[1] = coords[1];
				lastCoords[2] = coords[2];
				phase ++;

				if (phase > viewDistance) {
					phase = 1;
				}
				setTimeout(() => { this.bufferPlatforms(force, phase); }, 32);
			}

			loadInterior (name) {

			}
			enterInterior (name) {

			}


	};
