import Avatar from '../assets/entities/avatars/avatar'
import Entity from '../entity'
import { animate } from '../world/render'
import { GRID_SIZE } from '../config'

export default class SocketHandlers {

    constructor ( world, socket ) {

        this.world = world
        this.socket = socket

        socket.on( "update", packet => {

			let data   	  	  = JSON.parse( packet.data ),
				world  	  	  = this.world,
				voxels 	  	  = world.systems.terrain.voxels,
				coords    	  = world.getVoxel( data.position ),
				cameraCoords  = world.getVoxel( ),
				closeToCamera = Math.abs(cameraCoords[0] - coords[0]) < 3 && Math.abs(cameraCoords[2] - coords[2]) < 3,
				userVoxel 	  = null,
				entity 	  	  = null,
				avatar 	  	  = null,
				user   	  	  = null,
				pos    	  	  = null,
				quat   	  	  = null,
				mesh   	  	  = null,
				hands  	  	  = [],
				hand   	  	  = null,
				h      	  	  = 0

			if ( !! data.entity && world.terrain.loaded ) {

				entity = data.entity
				userVoxel = voxels[ coords[0]+'.0.'+coords[2]] 

				if ( entity.id != world.user.id) { //  && closeToCamera == false 

					pos = entity.position
					quat = entity.quaternion
					user = world.users[ "user"+entity.id ]

					if ( user == null ) {

						avatar = world.systems.assets.makeEntity( "default-avatar", true, { wholeBody: true, id: entity.id }, coords )
						user = world.users[ "user"+entity.id ] = {
							id: entity.id,
							avatar,
							mesh: null
						}

						let initPlayerAvatar = (newUser, newData) => {

							console.info("[Remote] User avatar init")
							avatar.init( window.three.scene )
							newUser.mesh = avatar.mesh
							
							if ( newData.entity.hands.length > 0 )
							
								setTimeout( () => {
									
									avatar.componentsByProp.hand[0].state.hand.toggleTrackedHands( true )
									
								}, 1000 )

						}

						if ( userVoxel == null ) {

							console.warn("[Remote] Voxel not loaded", coords)
							world.systems.terrain.loadVoxel( coords, loadedVoxel => { initPlayerAvatar( user, data ) })

						} else if ( userVoxel.loaded == false && userVoxel.fetching == false) {

							console.info("[Remote] Voxel being loaded...", coords)
							userVoxel.fetchData( loadedVoxel => { initPlayerAvatar( user, data ) } )

						} else if ( userVoxel.fetching ) {

							console.info("[Remote] Voxel already fetching...", coords)
							setTimeout( ()=> {

								initPlayerAvatar( user, data )

							}, 1000)

						} else {
							initPlayerAvatar( user, data )

						}

					} else if ( user && user.mesh ) {

						if ( data.entity.hands.length > 0 ) {
							
							hands = user.avatar.componentsByProp.hand
							
							while ( h < hands.length ) {
							
								hand = hands[ h ]
								hand.mesh.position.fromArray( data.entity.hands[ h ].pos )
								hand.mesh.quaternion.fromArray( data.entity.hands[ h ].quat )
								hand.mesh.updateMatrix()
								h += 1
							
							}

						}
						
						user.avatar.update( [ pos.x, pos.y, pos.z ], [ quat.x, quat.y, quat.z, quat.w ] )

					}

				}

			}

		})

		socket.on( "tool action", packet => {

			let data = JSON.parse( packet.data ),
                world = this.world,
                user = world.user,
				pos = data.position,
				coords = data.coords,
				voxel = world.terrain.voxels[ coords[0]+".0."+coords[2] ],
				quat = data.quaternion	

			if ( voxel == null || voxel.loaded == false ) {

				if ( voxel ) 
					
					world.systems.terrain.loadVoxel( coords )

				console.warn("[Remote] Voxel not loaded", coords)
				return

			}

			switch (data.tool) {
				case "Entity Tool":
					let ent = data.entity,
						entity = new Entity( ent.id, ent.components, data.position, data.quaternion, coords )

					voxel.entities.push(entity)
					entity.init(three.scene)
				break
				case "Component Tool":
					voxel.entities.map( voxelEnt => { // find & re-init entity

						if ( voxelEnt.id == data.entityId ) // console.log("got component tool message", data.entity.components); // concat with existing components array
						
							voxelEnt.update( false, false, voxelEnt.components.concat(data.entity.components), false, false, { ignoreRotation: true } )
						

					})
				break;
				case "Custom Tool":
					// check tool functionality from tool prop
				break
				case "Voxel Tool":

				break
				case "Update Tool":
					voxel.entities.map( voxelEnt => { // find & re-init entity.. also probably look up the right component to modify by id *******************

						if ( voxelEnt.id == data.entityId ) {
							//console.log("Update Tool message", data.components[0]) // concat with existing components array
							voxelEnt.update( false, false,  false, data.components[0], data.componentPath, { ignoreRotation: true } )
						}

					})
				break
				case "Delete Tool":
					voxel.entities.map( ( voxelEnt, i ) => { // find & re-init entity ^^^^^^

						if ( voxelEnt.id == data.entityId ) {

							console.log("got delete tool message", data.entityId) // concat with existing components array
							world.octree.remove( voxelEnt.mesh )
							three.scene.remove( voxelEnt.mesh )
							voxel.entities.splice( i, 1 )
							
						}
						
					})
				break
				case "Geotag Tool":
					// mostly going to use rest api for this..

				break
			}

			if ( world.IOTMode )

				animate( world, Date.now(), 0 )
				

		})

		socket.on( "rtc", packet => {

			let signal = JSON.parse( packet ),
				webrtc = this.world.systems.webrtc,
				peerConn = webrtc.peerConn

			if (!peerConn)
				webrtc.answerCall()

			if (signal.sdp) {
				peerConn.setRemoteDescription(new RTCSessionDescription(signal.sdp))

			} else if (signal.candidate) {
				peerConn.addIceCandidate(new RTCIceCandidate(signal.candidate))

			} else if (signal.closeConnection){
				webrtc.endCall()
			}

		})

    }

}