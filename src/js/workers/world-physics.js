export default class WorldPhysics {
	constructor() {
		this.worker = null;
	}

	init (world) {
		let worker = new Worker('/js/workers/physics.js');
	      worker.onmessage = function (event) {
	        let message = JSON.parse(event.data),
	          sys = world,
	          cam = three.camera,
	          user = sys.user,
	          position = [],
	          velocity = [];

	        if (message.command == "update") {
	          worker.postMessage('{"command":"update","data":{"position":['+cam.position.x+
	          ', '+cam.position.y+
	          ', '+cam.position.z+
	          '],"velocity":['+user.velocity.x+
	          ','+user.velocity.y+
	          ','+user.velocity.z+'] }}');

		  } else if (message.command == "collision") { // not implemented
	          console.log("collision");
	          console.log(message.data);
		  } else if (message.command == "platform collision") {
	          if (three.camera.position.y > message.data.position[1] && three.camera.position.y < 8500 + message.data.position[1]) {
				  three.camera.position.set(three.camera.position.x, message.data.position[1]+8500 , three.camera.position.z);
				  user.velocity.y *= -0.25;
			  } else if (three.camera.position.y < message.data.position[1] && three.camera.position.y > message.data.position[1] - 8500){
				  three.camera.position.set(three.camera.position.x, message.data.position[1]-8500 , three.camera.position.z);
				  user.velocity.y *= -0.25;
			  }
			  user.velocity.x *= 0.97;
			  user.velocity.z *= 0.97;
			  user.falling = false;

		 } else if (message.command == "voxel collision") {
			let cameraPosition = three.camera.position;
			cameraPosition.set(cameraPosition.x + message.data.position[0] / 80,
									  cameraPosition.y + message.data.position[1] / 80,
									  cameraPosition.z + message.data.position[2] / 80);

			user.velocity.x += message.data.position[0] / 8;
			user.velocity.y += message.data.position[1] / 8;
			user.velocity.z += message.data.position[2] / 8;
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
								user.velocity.x += position[0]*= -0.85;
	            } else {
	              cameraPosition.z = position[2];
								user.velocity.z += position[2] *= -0.85;
	            }
	          }
	          //sys.vibrate(50);
	        } else if (message.command == "load interior") {
	          console.log("load interior... ", message.data.coords);
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
