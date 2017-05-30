var observer = {
		position: [0, 0, 0],
		prevPos: [0, 0, 0],
		velocity: [0, 0, 0],
		vrHeight: 0
	},
	entities = [],
	voxels = []

function distance2d( a, b ) {

	return Math.sqrt( Math.pow((a[0]-b[0]), 2) + Math.pow((a[2]-b[2]),2) )

}

function distance2dCompare( a, b, n ) {

	return Math.pow((a[0]-b[0]), 2)+Math.pow((a[2]-b[2]), 2) < (n*n)

}

function distance3dCompare ( a, b, n ) {

	return (Math.pow((a[0]-b[0]), 2) + Math.pow((a[1]-b[1]),2) + Math.pow((a[2]-b[2]), 2) ) < (n*n);

}

self.update = function ( ) {

	var distance = 0,
		objPos = [],
		position = observer.position,
		innerBox = [false, false],
		velocity = observer.velocity,
		vrHeight = observer.vrHeight,
		closeToVenue =  false,
		collision = false,
		cKey = "",
		yPos = 0,
		size = 50000,
		obj = null,
		structure = null,
		bounds = [0, 0],
		voxel = null,
		delta = [0, 0],
		oPos = [],
		speed = 0,
		i = 0,
		v = 0

		for ( i = 0; i < voxels.length; i ++ ) {

			obj = voxels[i];

			if (!!obj  && distance2dCompare(position, obj.position, 2500000)) { 	// do collisions on voxels & structures... just walls at first..
					
				if (obj.loaded == undefined) {
				
					obj.loaded = true
					self.postMessage('{"command": "load entities", "data":{"coords":"'+obj.cell[0]+'.'+obj.cell[1]+'.'+obj.cell[2]+'"}}');
						
				}

				if (distance2dCompare(position, obj.position, 900000)) {
					
					let alt = obj.altitude || 0
						yPos = obj.position[1]
				
				if (distance2dCompare(position, obj.position, 528000)) {
					
					if (position[1] > yPos - 160000 + vrHeight  && position[1] < yPos + 470000 + vrHeight) {

						collision = true;
						self.postMessage('{"command": "platform collision", "data":{"type":"top", "position":[' + obj.position[0] + ',' + (yPos ) + ',' + obj.position[2] + '] }}');
				
					}

					if (!!obj.entities && obj.entities.length > 0) {

						obj.entities.map( entity=> {

							if ( distance3dCompare(position, entity.position, (entity.boundingRadius||20000)+10000) ) { 

								collision = true
								self.postMessage('{"command": "entity-user collision", "data":{"position":[' +obj.position[0] + ',' + obj.position[1] + ',' + obj.position[2] + '] }}')

							}

						})

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

self.onmessage = function ( event ) { 

	var message = JSON.parse(event.data),
			data = message.data,
			user = observer,
			c = 0,
			p = 0,
			items = [],
			platform = null,
			toRemove = null

	if ( message.command == "update" ) {
		// user.prevPos = [user.position[0], user.position[1], user.position[2]];
		user.position = data.position
		user.velocity = data.velocity
		user.vrHeight = data.vrHeight
		//self.postMessage(JSON.stringify(self.observer));
	} else if ( message.command == "add voxels" ) {
		voxels = voxels.concat(data);

	} else if ( message.command == "remove voxels" ) {
		p = data.length -1;
		while ( p >= 0 ) {
			toRemove = data[p];
			c = voxels.length-1;
			while ( c >= 0 ) {
				platform = voxels[c];
				if (platform != null) {
					if (platform.cell[0] == toRemove.cell[0] && platform.cell[1] == toRemove.cell[1]  && platform.cell[2] == toRemove.cell[2]) {
						voxels.splice(c, 1);
					}
				}
				c--;
			}
			p --;
		}
	} else if ( message.command == "clear" ) {
		voxels = [];

	} else if ( message.command == "start" ) {
		self.update();

	} else if ( message.command == "stop" ) {
		self.stop();

	} else if ( message.command == "log" ) {
		if (data == "") {
			self.postMessage('{"command":"log","data":[' + user.position[0] + ',' + user.position[1] + ',' + user.position[2] + ']}');
			self.postMessage('{"command":"log","data":' + JSON.stringify(voxels)+ '}');
		}
	}
};

self.stop = function () {

	clearTimeout(self.updateLoop)

}
