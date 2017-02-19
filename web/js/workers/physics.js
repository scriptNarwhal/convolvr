var observer = {
		position: [0, 0, 0],
		prevPos: [0, 0, 0],
		velocity: [0, 0, 0],
		vrHeight: 0
	},
	entities = [],
	platforms = [];
function distance2d(a, b) {
	return Math.sqrt(Math.pow((a[0]-b[0]),2) + Math.pow((a[2]-b[2]),2))
}
function distance2dCompare(a, b, n) {
	return Math.pow((a[0]-b[0]),2)+Math.pow((a[2]-b[2]),2) < (n*n)
}
function distance3dCompare (a, b, n) {
	return (Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2) + Math.pow((a[2]-b[2]),2)) < (n*n);
}

self.update = function () {
	var entities = [],
			distance = 0,
			objPos = [],
			position = observer.position,
			i = 0,
			v = 0,
			size = 50000,
			obj = null,
			structure = null,
			bounds = [0, 0],
			voxel = null,
			delta = [0, 0],
			innerBox = [false, false],
			oPos = [],
			speed = 0,
			velocity = observer.velocity,
			vrHeight = observer.vrHeight,
			closeToVenue =  false,
			cKey = "",
			collision = false,
			yPos = 0;

		for (i = 0; i < platforms.length; i ++) {
			obj = platforms[i];
			if (!!obj) {
					if (distance2dCompare(position, obj.position, 600000)) { 	// do collisions on voxels & structures... just walls at first..

						let alt = obj.altitude || 0
						yPos = obj.position[1]
						if (distance2dCompare(position, obj.position, 264000)) {
							if (position[1] > yPos - 160000 + vrHeight  && position[1] < yPos + 235000 + vrHeight) {
									collision = true;
									self.postMessage('{"command": "platform collision", "data":{"type":"top", "position":[' + obj.position[0] + ',' + (yPos ) + ',' + obj.position[2] + '] }}');

							} /*else if (position[1] < yPos - 12000 && position[1]  > yPos - 68000 ) {
									collision = true;
									self.postMessage('{"command": "platform collision", "data":{"type":"bottom", "position":[' + obj.position[0] + ',' + (yPos ) + ',' + obj.position[2] + '] }}');
							}*/
						}

							s = !! obj.structures ? obj.structures.length - 1 : -1;
							while (s > -1) {
								structure = obj.structures[s]
								objPos = [obj.position[0]+structure.position[0],
													obj.position[1]+structure.position[1]+180000,
													obj.position[2]+structure.position[2]]
								bounds = [size * structure.width, size * structure.floors, size * structure.length]
								if (structure.position != undefined) {
									if (!structure.interiorLoaded) {
											structure.interiorLoaded = true;
											self.postMessage('{"command":"load interior","data":{"coords": ' + JSON.stringify(obj.cell.join(".")) + '}}')
									}
								}
								if (distance2dCompare(position, objPos, 300000)) {
									oPos = objPos //structure.position
									if (position[0] > (oPos[0] - bounds[0]) && position[0] < (oPos[0] + bounds[0])) { 		// now actually check collisions using box method...
										innerBox[0] = (position[0] > (oPos[0] - bounds[0] + 4000) && position[0] < (oPos[0] + bounds[0] - 4000));
										delta[0] = Math.abs(position[0] - oPos[0]);

										if (position[2] > (oPos[2] - bounds[2]) && position[2] < (oPos[2] + bounds[2])) {
											innerBox[1] = (position[2] > (oPos[2] - bounds[2] + 4000) && position[2] < (oPos[2] + bounds[2] - 4000));
											delta[1] = Math.abs(position[2] - oPos[2]);
											let floor = Math.floor(((position[1] - oPos[1])) / size)-1,
											  	offset = (position[1] - oPos[1]) % size
											if (floor > -1 && floor < structure.floors+2) {
												if (offset < 2000+vrHeight ) { // floor collision
													position[1] = 2000+oPos[1] + (floor+1)*size
													 self.postMessage('{"command": "floor collision", "data":{"floor": '+floor+
													 ', "delta":[' + delta[0] + ',' + delta[1] + '], "position":[' + position[0] + ',' + position[1] + ',' + position[2] + '] }}')
												}
												if (offset > 45000) {
													if ((position[0] > oPos[0])) { // wall collision
														position[0] = oPos[0] + bounds[0]
													} else {
														position[0] = oPos[0] - bounds[0]
													}
													if (position[2] > oPos[2]) {
														position[2] = oPos[2] + bounds[2]
													} else {
														position[2] = oPos[2] - bounds[2]
													}
													collision = true
														self.postMessage('{"command": "structure collision", "data":{"inner": '+((innerBox[0] == true && innerBox[1] == true) ? 1 : 0)+
														', "delta":[' + delta[0] + ',' + delta[1] + '], "position":[' + position[0] + ',' + position[1] + ',' + position[2] + '] }}')
												}
											}
										}
									}
								}
								s--;
							}
							if (!!obj.voxels && obj.voxels.length > 0) {
								v = obj.voxels.length;
								while (v > 0) {
									v--;
									voxel = obj.voxels[v].cell;
									if (distance3dCompare(position, [-132000-10500+obj.position[0]+voxel[0]*10500,
																									 -10500+obj.position[1]+voxel[1]*10500,
																									 -132000+obj.position[2]+voxel[2]*10500], 14000)) {

										self.postMessage('{"command": "voxel collision", "data":{"position":[' + (position[0]-(voxel[0]*10500)-10500)
																											   + ',' +(position[1]-(voxel[1]*10500)-10500)
																											   + ',' +(position[2]-(voxel[2]*10500)) + '] }}');

									}
								}
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
	}, 15);
}

self.onmessage = function (event) { // Do some work.
	var message = JSON.parse(event.data),
			data = message.data,
			user = observer,
			c = 0,
			p = 0,
			items = [],
			platform = null,
			toRemove = null

	if (message.command == "update") {
		// user.prevPos = [user.position[0], user.position[1], user.position[2]];
		user.position = data.position
		user.velocity = data.velocity
		user.vrHeight = data.vrHeight
		//self.postMessage(JSON.stringify(self.observer));
	} else if (message.command == "add platforms") {
		platforms = platforms.concat(data);

	} else if (message.command == "remove platforms") {
		p = data.length -1;
		while (p >= 0) {
			toRemove = data[p];
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
		if (data == "") {
			self.postMessage('{"command":"log","data":[' + user.position[0] + ',' + user.position[1] + ',' + user.position[2] + ']}');
			self.postMessage('{"command":"log","data":' + JSON.stringify(platforms)+ '}');
			self.postMessage('{"command":"log","data":"' + JSON.stringify(entities)+'"}');
		}
	}
};

self.stop = function () {
	clearTimeout(self.updateLoop);
}
