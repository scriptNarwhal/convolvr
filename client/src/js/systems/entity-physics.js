export default class EntityPhysics {
	constructor(world) {
		this.world = world
		let worker = this.worker = new Worker('/js/workers/entity.js')
	      worker.onmessage = function (event) {
	        let message = JSON.parse(event.data),
  	          vrFrame = world.vrFrame,
  						vrHeight = 0,
  	          cam = three.camera,
  	          user = world.user,
  	          position = [],
  	          velocity = [],
							voxel = null
							
			if (vrFrame != null && vrFrame.pose != null && vrFrame.pose.position != null) {
					vrHeight = 22000 * vrFrame.pose.position[1]
					world.vrHeight = vrHeight
			}
	    if (message.command == "update") {
	        worker.postMessage('{"command":"update","data":{"position":['+cam.position.x+', '+cam.position.y+', '+cam.position.z+
	                           '],"velocity":['+user.velocity.x+','+user.velocity.y+','+user.velocity.z+
						                 '],"vrHeight":'+vrHeight+'}}')

			} else if (message.command == "entity-user collision") {
				console.log("entity-user collision")

			} else if (message.command == "entity-entity collision") {
				console.log("entity-entity collision")

			} else {
	        console.log(message.data)
	    }
	  }
	   worker.postMessage('{"command":"start","data":""}')
		 this.worker = worker
	}

	init () {
		
	}
}
