export default class EntityPhysics {
	constructor() {
		this.worker = null;
	}

	init (world) {
		let worker = new Worker('/js/workers/entity.js')
	      worker.onmessage = function (event) {
	        let message = JSON.parse(event.data),
  	          sys = world,
  						vrFrame = world.vrFrame,
  						vrHeight = 0,
  	          cam = three.camera,
  	          user = sys.user,
  	          position = [],
  	          velocity = []
			if (vrFrame != null && vrFrame.pose != null && vrFrame.pose.position != null) {
					vrHeight = 22000 * vrFrame.pose.position[1]
					sys.vrHeight = vrHeight
			}
	    if (message.command == "update") {
	        worker.postMessage('{"command":"update","data":{"position":['+cam.position.x+', '+cam.position.y+', '+cam.position.z+
	                           '],"velocity":['+user.velocity.x+','+user.velocity.y+','+user.velocity.z+
						                 '],"vrHeight":'+vrHeight+'}}')

		  } else {
	         console.log(message.data)
	    }
	  };

	   worker.postMessage('{"command":"start","data":""}')
		 this.worker = worker
		 return worker
	}
}
