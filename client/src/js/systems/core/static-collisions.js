let entPos = new THREE.Vector3()

export default class StaticCollisions {

	constructor( world ) {

		this.worker = null
		let worker = new Worker('/data/js/workers/static-collision.js')

	      worker.onmessage = function ( event ) {

	        let message = JSON.parse(event.data),
	          	vrFrame = world.vrFrame,
				vrHeight = 0,
	          	cam = three.camera,
	          	user = world.user,
				userPos = three.camera.position,
	          	position = [],
	          	velocity = []

			if (vrFrame != null && vrFrame.pose != null && vrFrame.pose.position != null) {

				vrHeight = 1 * vrFrame.pose.position[1]
				world.vrHeight = vrHeight

			}

	    if ( message.command == "update" ) {

	          worker.postMessage('{"command":"update","data":{"position":['+cam.position.x+
	          ', '+cam.position.y+
	          ', '+cam.position.z+
	          '],"velocity":['+user.velocity.x+
	          ','+user.velocity.y+
	          ','+user.velocity.z+
						'],"vrHeight":'+vrHeight+'}}');

		} else if ( message.command == "collision" ) { console.log("collision") // not implemented
	          
	        console.log(message.data)

		}  else if ( message.command == "entity-user collision" ) {  console.log("!!!!!  entity-user collision", message.data)

			entPos.fromArray( message.data.position )

			let distance = entPos.distanceTo( userPos ),
				direction = entPos.sub(userPos)	

			if ( distance < 0.090) { // debug

				//user.velocity.sub( direction.multiplyScalar(100) )

			}

		} else if ( message.command == "platform collision" ) { // consider sending "top" or "bottom" collision type

	      if ( message.data.type == "top" ) {

				three.camera.position.set( three.camera.position.x, message.data.position[1]+13.5 +vrHeight, three.camera.position.z )	

				if ( Math.abs( user.velocity.y ) > 40 ) {

					window.navigator.vibrate && window.navigator.vibrate(50)
					user.velocity.y *= -0.56
					user.falling = true

				} else {

					user.falling = false
					user.velocity.y = 0

				}
				
			} else if ( message.data.type == "bottom" ) {

				three.camera.position.set( three.camera.position.x, message.data.position[1]-4 +vrHeight, three.camera.position.z )
				user.velocity.y *= -0.45
			}

			user.velocity.x *= 0.98
			user.velocity.z *= 0.98
			user.falling = false

			} else if ( message.command == "floor collision" ) { 
				// console.log("floor collision", message.data.position, message.data)
				three.camera.position.set(three.camera.position.x, message.data.position[1]+vrHeight, three.camera.position.z)

				if ( Math.abs(user.velocity.y) > 0.100 ) {

					user.velocity.y *= 0.66
					user.velocity.x *= 0.96
					user.velocity.z *= 0.96
					user.falling = true

				} else {

					user.falling = false
					user.velocity.y = 0

				}

			} else if ( message.command == "load entities" ) {
				
				world.generateFullLOD(message.data.coords)

			} else {

				console.log(message.data)

			}

		}

	    worker.postMessage('{"command":"start","data":""}')
		this.worker = worker
	}

	init ( component ) {
		
		return {

		}

	}

}
