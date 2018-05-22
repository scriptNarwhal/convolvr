import Convolvr from '../../../world/world'
import Component from '../../../core/component'
import Entity from '../../../core/entity'

import * as THREE from 'three';
let entPos = new THREE.Vector3()

export default class StaticCollisions {

	world:  Convolvr
	worker: Worker

	constructor( world: Convolvr ) {

		this.worker = new Worker('/data/js/workers/static-collisions-bundle.js')

		let worker: Worker = this.worker,
			three:  any = (window as any).three || {}

	      worker.onmessage = function ( event: any ) {

			let eventData: string        = event.data || '{}',
				message:   any        = JSON.parse(eventData),
	          	vrFrame:   any        = world.vrFrame,
				vrHeight:  number        = 0,
	          	cam:       any  		 = three.camera,
	          	user:      any       	 = world.user,
				userPos:   any 			 = three.camera.position,
	          	position:  Array<number> = [],
	          	velocity:  Array<number> = []

			if (vrFrame != null && vrFrame.pose != null && vrFrame.pose.position != null) {
				vrHeight = 1 * vrFrame.pose.position[1]
				world.vrHeight = vrHeight+1.5
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

		}  else if ( message.command == "entity-user collision" ) { 

			//entPos.fromArray( message.data.position )

			let distance = entPos.distanceTo( userPos ),
				oldYV = user.velocity.y,
				direction = entPos.sub(userPos)	

			if ( distance < 30 ) { // debug
				user.velocity.sub( direction.multiplyScalar(10) )
				user.velocity.y = oldYV
			}

		} else if ( message.command == "platform collision" ) { // consider sending "top" or "bottom" collision type

	      if ( message.data.type == "top" ) {

				cam.position.set( cam.position.x, 13.25 + message.data.position[1] +(vrHeight != 0 ? vrHeight+0.25 : 0), cam.position.z )	

				// if ( Math.abs( user.velocity.y ) > 150 ) {
				// 	window.navigator.vibrate && window.navigator.vibrate(50)
				// 	user.velocity.y *= -0.8
				// 	user.falling = true
				// } else {
					user.falling = false
					user.velocity.y = 0
				// }
				
			} else if ( message.data.type == "bottom" ) {
				cam.position.set( cam.position.x, message.data.position[1]-4 +vrHeight, cam.position.z )
				user.velocity.y *= -0.45
			}

			user.velocity.x *= 0.98
			user.velocity.z *= 0.98
			user.falling = false

			} else if ( message.command == "floor collision" ) { 
				//cam.position.set(cam.position.x, message.data.position[1]+vrHeight+2, cam.position.z)

				if ( user.velocity.y < -15 ) {
					user.velocity.y *= -0.76
					user.velocity.x *= 0.97
					user.velocity.z *= 0.97
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
