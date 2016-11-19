/*  Pylon Desktop | physics.js
Jeremy Evans Openspacehexagon@gmail.com
*/
var observer = {
		position: [0, 0, 0],
		prevPos: [0, 0, 0],
		velocity: [0, 0, 0]
	},
	entities = [],
	platforms = [];

function CollisionTower (data) {
	this.data = data;
	this.name = data.name;
	this.position = data.position;
	this.interiorLoaded = false;
}

function distance3d (a, b) {
	return Math.sqrt(Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2) + Math.pow((a[2]-b[2]),2));
}

function distance2d (a, b) {
	return Math.sqrt(Math.pow((a.x-b.x),2)+Math.pow((a.z-b.z),2));
}
function distance2dArray (a, b) {
	return Math.sqrt(Math.pow((a[0]-b[0]),2)+Math.pow((a[2]-b[2]),2));
}

self.update = function () {
	var entities = [],
			distance = 0,
			position = observer.position,
			i = 0,
			v = 0,
			size = 50000,
			obj = null,
			structure = null,
			voxel = null,
			delta = [0, 0],
			innerBox = [false, false],
			oPos = [],
			speed = 0,
			velocity = observer.velocity,
			closeToVenue =  false,
			chunkDimensions = [6150 * 6, 3200 * 6 * Math.sqrt(3)],
			cKey = "",
			collision = false;

		for (i = 0; i < platforms.length; i ++) {
			obj = platforms[i];
			if (!!obj) {
				if (position[1] > obj.position[1] && position[1] < obj.position[1] + 8500) {
					if (distance2dArray(position, obj.position) < 132000) {
						collision = true;
						self.postMessage('{"command": "platform collision", "data":{"position":[' + obj.position[0] + ',' + obj.position[1] + ',' + obj.position[2] + '] }}');
					}
				} else if (position[1] < obj.position[1] && obj.position[1] > obj.position[1] - 56500) {
					if (distance2dArray(position, obj.position) < 132000) {
						collision = true;
						self.postMessage('{"command": "platform collision", "data":{"position":[' + obj.position[0] + ',' + (obj.position[1]-56500) + ',' + obj.position[2] + '] }}');
					}
				}
					if (distance2dArray(position, obj.position) < 200000) { 	// do collisions on structures... just walls at first..
							s = !! obj.structures ? obj.structures.length - 1 : -1;
							while (s > -1) {
								structure = obj.structures[s];
								distance = distance2dArray(position, [structure.position[0]+structure.position[0]*size,
																											structure.position[1]+structure.position[1]*size,
																											structure.position[2]+structure.position[2]*size]);
								if (distance < 480000) {
									if (structure.name != undefined) {
										if (!structure.interiorLoaded) {
											structure.interiorLoaded = true;
											console.log("loadInterior...");
											self.postMessage('{"command":"load interior","data":' + JSON.stringify(structure) + '}');
										}
										if (!closeToVenue && distance < 320000) {
											closeToVenue = true;
											self.postMessage('{"command":"enter interior", "data":{"name":"'+structure.name+'"}}');
										}
									}
									oPos = structure.position;
									if (position.x > (oPos[0] - size * structure.width) && position.x < (oPos[0] + size * structure.width)) { 		// now actually check collisions using box method...
										innerBox[0] = (position.x > (oPos[0] - size * structure.width + 600) && position.x < (oPos[0] + size * structure.width - 600));
										delta[0] = Math.abs(position.x - oPos[0]);
										if (position.z > (oPos[2] - size * structure.length) && position.z < (oPos[2] + size * structure.length)) {
											innerBox[1] = (position.z > (oPos[2] - size * structure.length + 600) && position.z < (oPos[2] + size * structure.length - 600));
											delta[1] = Math.abs(position.z - oPos[2]);
											if ((position.x > oPos[0])) {
												position.x = oPos[0] + size;
											} else {
												position.x = oPos[0] - size;
											}
											if (position.z > oPos[2]) {
												position.z = oPos[2] + size;
											} else {
												position.z = oPos[2] - size;
											}
											if (distance > size * 1.18) {
												collision = true;
												self.postMessage('{"command": "structure collision", "data":{"inner": '+((innerBox[0] == true && innerBox[1] == true) ? 1 : 0)+
												', "delta":[' + delta[0] + ',' + delta[1] + '], "position":[' + position.x + ',' + position.y + ',' + position.z + '] }}');
											}
										}
									}
								}
								s--;
							}
					}

					if (distance2dArray(position, obj.position) < 132000) {
						if (!!obj.voxels && obj.voxels.length > 0) {
							v = obj.voxels.length;
							while (v > 0) {
								v--;
								voxel = obj.voxels[v].cell;
								if (distance3d(position, [obj.position[0]+voxel[0]*10500, obj.position[1]+voxel[1]*10500, obj.position[2]+voxel[2]*10500]) < 12000) {

									self.postMessage('{"command": "voxel collision", "data":{"position":[' + (position[0]-(voxel[0]*10500))
																										   + ',' +(position[1]-(voxel[1]*10500))
																										   + ',' +(position[2]-(voxel[2]*10500)) + '] }}');

								}
							}
						}
					}
			}
		}

		for (i = 0; i < entities.length; i ++) {
			obj = entities[i];
			if (!!obj) {
				if (position[1] < obj.position[1] + 1000 && position[1] > obj.position[1]-2000 ) {
					if (distance2dArray(position, obj.position) < 128000) {
						collision = true;
						self.postMessage('{"command": "entity collision", "data":{"position":[' +obj.position[0] + ',' + obj.position[1] + ',' + obj.position[2] + '] }}');
					}
				}
			}
		}

	if (!collision) {
		observer.prevPos = [observer.position[0], observer.position[1], observer.position[2]];
	}

	self.postMessage('{"command": "update"}');
	self.updateLoop = setTimeout(function () {
		self.update();
	}, 33);
}

self.onmessage = function (event) { // Do some work.
	var message = JSON.parse(event.data),
		user = observer,
		c = 0,
		p = 0,
		items = [],
		platform = null,
		toRemove = null;

	if (message.command == "update") {
		// user.prevPos = [user.position[0], user.position[1], user.position[2]];
		user.position = message.data.position;
		user.velocity = message.data.velocity;
		//self.postMessage(JSON.stringify(self.observer));
	} else if (message.command == "add entities") {
		entities = entities.concat(message.data);

	} else if (message.command == "remove entity") {
		c = entities.length-1;
		while (c >= 0) {
			if (entities[c].id == message.data) {
				entities = entities.splice(c, 1);
			}
			c--;
		}
	} else if (message.command == "add platforms") {
		platforms = platforms.concat(message.data);

	} else if (message.command == "remove platforms") {
		p = message.data.length -1;
		while (p >= 0) {
			toRemove = message.data[p];
			c = platforms.length-1;
			while (c >= 0) {
				platform = platforms[c];
				if (platform != null) {
					if (platform.cell[0] == toRemove.cell[0] && platform.cell[1] == toRemove.cell[1]  && platform.cell[2] == toRemove.cell[2]) {
						//platforms.splice(c, 1);
					}
				}
				c--;
			}
			p --;
		}
	} else if (message.command == "clear") {
		platforms = [];
		entities = [];

	} else if (message.command == "start") {
		self.update();

	} else if (message.command == "stop") {
		self.stop();

	} else if (message.command == "log") {
		if (message.data == "") {
			self.postMessage('{"command":"log","data":[' + user.position.x + ',' + user.position.y + ',' + user.position.z + ']}');
			self.postMessage('{"command":"log","data":' + JSON.stringify(platforms)+ '}');
			self.postMessage('{"command":"log","data":"' + JSON.stringify(entities)+'"}');
		}
	}
};

self.stop = function () {
	clearTimeout(self.updateLoop);
}
