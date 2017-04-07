/* entity worker */
// collisions btween entities in motion and other entities
var voxels = [], // map of string coordinates to arrays of entities
    observer = {
  		position: [0, 0, 0],
  		prevPos: [0, 0, 0],
  		velocity: [0, 0, 0],
  		vrHeight: 0
  	}


function distance2d(a, b) {
	return Math.sqrt(Math.pow((a[0]-b[0]),2) + Math.pow((a[2]-b[2]),2))
}
function distance2dCompare(a, b, n) {
	return Math.pow((a[0]-b[0]),2)+Math.pow((a[2]-b[2]),2) < (n*n)
}
function distance3dCompare (a, b, n) {
	return (Math.pow((a[0]-b[0]),2) + Math.pow((a[1]-b[1]),2) + Math.pow((a[2]-b[2]),2)) < (n*n);
}

self.onmessage = function (event) { // Do some work.
	let message = JSON.parse(event.data),
			data = message.data,
      entities = [],
      voxel = null,
      user = observer,
			c = 0

  if (message.command == "set in motion") {
    // implement

  } else if (message.command == "become static") {
    // implement

  } else if (message.command == "add voxels") {
    data.map((voxel) => {
      voxels[voxel.cell.join(".")] = voxel
    })
  } else if (message.command == "remove voxels") {
    p = data.length -1;
		while (p >= 0) {
			toRemove = data[p];
			voxels[toRemove.cell] = null
			p --;
		}
  } else if (message.command == "add entity") {
    entities = voxels[data.coords.join(".")].entities
    if (entities != null) {
      voxels[data.coords.join("x")].entities.push(data.entity)
    }
  } else if (message.command == "remove entity") {
    entities = voxels[data.coords.join(".")].entities
    if (entities != null) {
      c = entities.length-1;
  		while (c >= 0) {
  			if (entities[c].id == data.entityId) {
  				voxels[data.coords.join(".")].entities.splice(c, 1)
          c = -1
        }
  			c--;
  		}
    }
  } else if (message.command == "update") {
    user.position = data.position
		user.velocity = data.velocity
		user.vrHeight = data.vrHeight
  } else if (message.command == "start") {
		self.update();

	} else if (message.command == "stop") {
		self.stop();
  }
};

self.stop = function () {
	clearTimeout(self.updateLoop);
}

self.update = function () {
  let entities = [],
      user = observer,
      position = user.position,
      secondPos = null,
      coords = [Math.floor(position[0]/928000), 0, Math.floor(position[2]/807360)],
      key = '',
      x = - 1,
      z = - 1,
      i = 0,
      o = 0

  while (x <= 2) { // only simulate entities in 9 voxels around the user
    while (z <= 2) {
      key = (x+coords[0])+'.0.'+(z+coords[2])
      if (voxels[key] != null) {
        entities = voxels[key].entities
        if (!!entities) {
          i = entities.length
          while (i >= 0) {
            obj = entities[i];
            if (!!obj) {
              if (position[1] < obj.position[1] + 5000 && position[1] > obj.position[1]-5000 ) {  // compare to user
                if (distance2dCompare(position, obj.position, 32000)) {
                  collision = true;
                  self.postMessage('{"command": "entity-user collision", "data":{"position":[' +obj.position[0] + ',' + obj.position[1] + ',' + obj.position[2] + '] }}')
                }
              }
              if (!! obj.moving) { //moving) {
                o = entities.length -1 // if moving, check collisions against all other entities (in that voxel)
                while (o >= 0) {
                  secondPos = entities[o].position
                  if (distance3dCompare(secondPos, obj.position, 15000)) { // look up the proper radius
                    // send back the new position and velocity for both entities
                    self.postMessage('{"command": "entity-entity collision", "data":{"entities":[{"position":['+obj.position[0] + ',' + obj.position[1] + ',' + obj.position[2] + '],"velocity": [0, 0, 0] }, {"position":['+secondPos[0] + ',' + secondPos[1] + ',' + secondPos[2] + '],"velocity": [0, 0, 0] }]}}')

                  }
                }
              }
            }
            i --
          }
        }
      }
      ++ z
    }
    ++ x
  }

  self.postMessage('{"command": "update"}');
	self.updateLoop = setTimeout(function () {
		self.update();
	}, 15);
}
