/* entity worker */
// collisions btween entities in motion and other entities
var entities = [],
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
      user = observer,
			c = 0

  if (message.command == "set in motion") {
    // implement

  } else if (message.command == "become static") {
    // implement

  } else if (message.command == "add entities") {
    entities = entities.concat(data);

  } else if (message.command == "remove entity") {
    c = entities.length-1;
		while (c >= 0) {
			if (entities[c].id == data) {
				entities = entities.splice(c, 1);
			}
			c--;
		}

  } else if (message.command == "update") {
    // implement
    user.position = data.position
		user.velocity = data.velocity
		user.vrHeight = data.vrHeight
  } else if (message.command == "start") {
		self.update();

	} else if (message.command == "stop") {
		self.stop();
};

self.stop = function () {
	clearTimeout(self.updateLoop);
}

self.update = function () {
  let i = 0
  for (i = 0; i < entities.length; i ++) {
    obj = entities[i];
    if (!!obj) {
      if (position[1] < obj.position[1] + 1000 && position[1] > obj.position[1]-2000 ) {
        if (distance2dCompare(position, obj.position, 32000)) {
          collision = true;
          self.postMessage('{"command": "entity collision", "data":{"position":[' +obj.position[0] + ',' + obj.position[1] + ',' + obj.position[2] + '] }}');
        }
      }
    }
  }

  self.postMessage('{"command": "update"}');
	self.updateLoop = setTimeout(function () {
		self.update();
	}, 15);
}
