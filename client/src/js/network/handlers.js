import Avatar from '../assets/entities/avatars/avatar'
import Entity from '../entity'
import { animate } from '../world/render'
import { GRID_SIZE } from '../config'

export default class SocketHandlers {

    constructor ( world, socket ) {

        this.world = world
        this.socket = socket

        socket.on( "update", packet => {

			let data   = JSON.parse( packet.data ),
				world  = this.world,
				voxel  = [0, 0, 0],
				entity = null,
				avatar = null,
				user   = null,
				pos    = null,
				quat   =  null,
				mesh   = null,
				hands  = [],
				hand   = null,
				h      = 0

			if ( !! data.entity ) {

				entity = data.entity

				if ( entity.id != world.user.id ) {

					pos = entity.position
					quat = entity.quaternion
					user = world.users[ "user"+entity.id ]
					
					if ( user == null ) {

						// voxel = [ Math.floor( pos.x / GRID_SIZE[ 0 ] ), 0, Math.floor( pos.z / GRID_SIZE[ 2 ] ) ]

						// if ( typeof world.systems.terrain.voxels[ voxel[0]+'.0.'+voxel[2]] != 'object' ) {

						// 	world.systems.terrain.loadVoxel( voxel )

						// }

						avatar = world.systems.assets.makeEntity( "default-avatar", true, { wholeBody: true, id: entity.id }, voxel )
						avatar.init( window.three.scene )
						user = world.users[ "user"+entity.id ] = {
							id: entity.id,
							avatar,
							mesh: avatar.mesh
						}
						
						if ( data.entity.hands.length > 0 ) {

							setTimeout( () => {
								user.avatar.componentsByProp.hand[0].state.hand.toggleTrackedHands( true )
							}, 1000 )

						}

					}

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

		})

		socket.on( "tool action", packet => {

			let data = JSON.parse( packet.data ),
                world = this.world,
                user = world.user,
				pos = data.position,
				coords = data.coords,
				voxel = world.terrain.voxels[ coords[0]+".0."+coords[2] ],
				quat = data.quaternion	

			//console.log("Tool Action", data )

			switch (data.tool) {
				case "Entity Tool":
					let ent = data.entity,
						entity = new Entity( ent.id, ent.components, data.position, data.quaternion, coords )

					voxel.entities.push(entity)
					entity.init(three.scene)
				break
				case "Component Tool":
					voxel.entities.map( voxelEnt => { // find & re-init entity

						if ( voxelEnt.id == data.entityId ) { // console.log("got component tool message", data.entity.components); // concat with existing components array
						
							voxelEnt.update( false, false, voxelEnt.components.concat(data.entity.components))
						
						}

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
							voxelEnt.update( false, false,  false, data.components[0], data.componentPath )
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

			if ( world.IOTMode ) {

				animate( world, Date.now(), 0 )
				
			}

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