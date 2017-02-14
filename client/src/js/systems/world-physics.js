export default class WorldPhysics {
	constructor() {
		this.worker = null;
	}

	init (world) {
		let worker = new Worker('/js/workers/physics.js');
	      worker.onmessage = function (event) {
	        let message = JSON.parse(event.data),
	          sys = world,
						vrFrame = world.vrFrame,
						vrHeight = 0,
	          cam = three.camera,
	          user = sys.user,
	          position = [],
	          velocity = [];
			if (vrFrame != null && vrFrame.pose != null && vrFrame.pose.position != null) {
					vrHeight = 22000 * vrFrame.pose.position[1] + 3000
					sys.vrHeight = vrHeight
			}
	    if (message.command == "update") {
	          worker.postMessage('{"command":"update","data":{"position":['+cam.position.x+
	          ', '+cam.position.y+
	          ', '+cam.position.z+
	          '],"velocity":['+user.velocity.x+
	          ','+user.velocity.y+
	          ','+user.velocity.z+
						'],"vrHeight":'+vrHeight+'}}');

		  } else if (message.command == "collision") { // not implemented
	          console.log("collision");
	          console.log(message.data);
		  } else if (message.command == "platform collision") { // consider sending "top" or "bottom" collision type
	      if (message.data.type == "top") {
				  three.camera.position.set(three.camera.position.x, message.data.position[1]+85000 +vrHeight, three.camera.position.z);
					if (Math.abs(user.velocity.y) > 10000) {
						user.velocity.y *= -0.56
						user.falling = true
					} else {
						user.falling = false
						user.velocity.y *= 0.2
					}
			  } else if (message.data.type == "bottom"){
				  three.camera.position.set(three.camera.position.x, message.data.position[1]-85000 +vrHeight, three.camera.position.z);
				  user.velocity.y *= -0.45
			  }
			  user.velocity.x *= 0.98
			  user.velocity.z *= 0.98
			  user.falling = false

		 } else if (message.command == "voxel collision") {
			let cameraPosition = three.camera.position
			cameraPosition.set(cameraPosition.x + message.data.position[0] / 80,
									  cameraPosition.y + message.data.position[1] / 80,
									  cameraPosition.z + message.data.position[2] / 80)

			user.velocity.x += message.data.position[0] / 8
			user.velocity.y += message.data.position[1] / 8
			user.velocity.z += message.data.position[2] / 8
			 user.falling = false;

		} else if (message.command == "user collision") { // could trigger interaction / bater / chat screen
	          console.log(message.data);

		  } else if (message.command == "structure collision") { // left over from subnexus.fm ..might come in handy
						let cameraPosition = three.camera.position;
	          position = message.data.position;
	          if (message.data.inner == 0 ) {
	            sys.user.falling = false;
	            if (message.data.delta[0] > message.data.delta[1]) {
	              cameraPosition.x = position[0];
								user.velocity.x += position[0]*= -0.25
	            } else {
	              cameraPosition.z = position[2];
								user.velocity.z += position[2] *= -0.25
	            }
	          }
	          //sys.vibrate(50);
	        } else if (message.command == "floor collision") { // consider sending "top" or "bottom" collision type
			     	three.camera.position.set(three.camera.position.x, message.data.position[1]+vrHeight, three.camera.position.z);
						if (Math.abs(user.velocity.y) > 20000) {
							user.velocity.y *= 0.55
								user.velocity.x *= 0.96
								user.velocity.z *= 0.96
								user.falling = true
						} else {
								user.falling = false
								user.velocity.y *= 0.2
						}
					} else if (message.command == "load interior") {
	          world.generateFullLOD(message.data.coords);

	        } else if (message.command == "enter interior") {
	          if (message.data.name != sys.venue) {
	            //console.log("message.data.name", data.data.name);
	            sys.venue = message.data.name;
	            world.enterInterior(message.data.name);
	          }
	        } else {
	          console.log(message.data);
	        }

	      };

	    worker.postMessage('{"command":"start","data":""}');
		  this.worker = worker;
		  return worker;
	}

}
