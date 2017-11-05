//@flow
import Convolvr from '../../world/world'
import Component from '../../component'
import Entity from '../../entity'
import * as THREE from 'three'


let entPos = new THREE.Vector3()

export default class StaticCollisions {

	world:  Convolvr
	worker: Worker

	constructor( world: Convolvr ) {

		this.worker = new Worker('/data/js/workers/static-collision.js')

		let worker: Worker = this.worker,
			three:  Object = window.three || {}

	      worker.onmessage = function ( event: Object ) {

			let eventData: string        = event.data || '{}',
				message:   Object        = JSON.parse(eventData),
	          	vrFrame:   Object        = world.vrFrame,
				vrHeight:  number        = 0,
	          	cam:       THREE.Camera  = three.camera,
	          	user:      Object        = world.user,
				userPos:   THREE.Vector3 = three.camera.position,
	          	position:  Array<number> = [],
	          	velocity:  Array<number> = []

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

				three.camera.position.set( three.camera.position.x, message.data.position[1]+14.25 +(vrHeight != 0 ? vrHeight-1 : 0), three.camera.position.z )	

				if ( Math.abs( user.velocity.y ) > 400 ) {

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

				if ( Math.abs(user.velocity.y) > 1 ) {

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

	init ( component: Component ) {
		
		return {

		}

	}

}
