/*  Pylon Desktop | physics.js
Jeremy Evans Openspacehexagon@gmail.com
*/
var observer = {
		position: [0, 0, 0],
		prevPos: [0, 0, 0],
		velocity: [0, 0, 0]
	},
	entities = [],
	platforms = [],
	towers = [],
	tracks = [],
	towers = [];

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
	var 	entities = [],
			distance = 0,
			position = observer.position,
			i = 0,
			v = 0,
			size = 2600,
			obj = null,
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
				if (position[1] < obj.position[1] + 8500 && position[1] > obj.position[1]-8500 ) {
					if (distance2dArray(position, obj.position) < 126000) {
						collision = true;
						//console.log('{"command": "platform collision", "data":{"position":[' + observer.prevPos[0] + ',' + observer.prevPos[1] + ',' + observer.prevPos[2] + '] }}');
						self.postMessage('{"command": "platform collision", "data":{"position":[' + obj.position[0] + ',' + obj.position[1] + ',' + obj.position[2] + '] }}');

					}
				}
					if (distance2dArray(position, obj.position) < 126000) {
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

// do collisions on towers... just walls at first..
	i = towers.length - 1;

	while (i > -1) {
		obj = towers[i];
		distance = distance2dArray(position, obj.position);
		if (distance < 12000) {
			if (!obj.interiorLoaded) {
				obj.interiorLoaded = true;
				console.log("loadInterior...");
				self.postMessage('{"command":"load interior","data":' + JSON.stringify(obj) + '}');
			}

			if (!closeToVenue && distance < 8000) {
				closeToVenue = true;
				self.postMessage('{"command":"enter interior", "data":{"name":"'+obj.name+'"}}');
			}

			oPos = obj.position;
			if (position.x > (oPos[0] - size) && position.x < (oPos[0] + size)) { 		// now actually check collisions using box method...
				innerBox[0] = (position.x > (oPos[0] - size + 600) && position.x < (oPos[0] + size - 600));
				delta[0] = Math.abs(position.x - oPos[0]);

				if (position.z > (oPos[2] - size) && position.z < (oPos[2] + size)) {
					innerBox[1] = (position.z > (oPos[2] - size + 600) && position.z < (oPos[2] + size - 600));
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
						self.postMessage('{"command": "tower collision", "data":{"inner": '+((innerBox[0] == true && innerBox[1] == true) ? 1 : 0)+
						', "delta":[' + delta[0] + ',' + delta[1] + '], "position":[' + position.x + ',' + position.y + ',' + position.z + '] }}');
						// "velocity": ['+velocity[0]+','+velocity[1]+','+velocity[2]+']

					}
				}
			}
		}

		i--;
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
	//console.log(message.command);

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
		console.log("add platforms");
		console.log(message.data.length);
		platforms = platforms.concat(message.data);

	} else if (message.command == "remove platforms") {
		console.log("remove platforms");
		console.log(message.data.length);
		p = message.data.length -1;
		while (p >= 0) {
			toRemove = message.data[p];
			c = platforms.length-1;
			while (c >= 0) {
				platform = platforms[c];
				if (platform != null) {
					if (platform.cell[0] == toRemove.cell[0] && platform.cell[1] == toRemove.cell[1]  && platform.cell[2] == toRemove.cell[2]) {
						//platforms = platforms.splice(c, 1);
					}
				}
				c--;
			}
			p --;
		}

	} else if (message.command == "add tracks") {
		tracks = tracks.concat(message.data);

	} else if (message.command == "remove track") {
		c = tracks.length-1;
		while (c >= 0) {
			if (tracks[c].id == message.data) {
				tracks = tracks.splice(c, 1);
			}
			c--;
		}
	}  else if (message.command == "clear") {
		platforms = [];
		entities = [];
		tracks = [];
		towers = [];

	} else if (message.command == "start") {
		self.update();

	} else if (message.command == "stop") {
		self.stop();

	} else if (message.command == "log") {
		self.postMessage('{"command":"log","data":[' + user.position.x + ',' + user.position.y + ',' + user.position.z + ']}');
		self.postMessage('{"command":"log","data":"' + JSON.stringify(entities)+'", platforms: "'+JSON.stringify(platforms)+'"}');

	}
};

self.stop = function () {
	clearTimeout(self.updateLoop);
}
