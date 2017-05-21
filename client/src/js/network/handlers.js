import Avatar from '../assets/avatars/avatar'
import Entity from '../entity'
import { animate } from '../world/render'

export default class SocketHandlers {

    constructor ( world, socket ) {

        this.world = world
        this.socket = socket

        socket.on("update", packet => {

			let data = JSON.parse(packet.data),
                world = this.world,
				entity = null,
				user = null,
				pos = null,
				quat = null,
				mesh = null

			if (!! data.entity) {

				entity = data.entity

				if (entity.id != world.user.id) {

					pos = entity.position
					quat = entity.quaternion
					user = world.users["user"+entity.id]
					if (user == null) {
						user = world.users["user"+entity.id] = {
							id: entity.id,
							avatar: new Avatar(entity.id, true, {forceHands: true}), // render whole body, not just hands
							mesh: null
						}
					}
					user.mesh = user.avatar.mesh
					user.avatar.update( [ pos.x, pos.y, pos.z ], [ quat.x, quat.z, quat.y, quat.w ] )

				}

			}

		})

		socket.on("tool action", packet => {

			let data = JSON.parse(packet.data),
                    world = this.world,
                    user = world.user,
					pos = data.position,
					coords = data.coords,
					chunk = world.terrain.voxels[coords[0]+".0."+coords[2]],
					quat = data.quaternion

			switch (data.tool) {
				case "Entity Tool":
					let ent = data.entity,
							entity = new Entity(ent.id, ent.components, data.position, data.quaternion)
					chunk.entities.push(entity)
					entity.init(three.scene)
				break
				case "Component Tool":
					chunk.entities.map(voxelEnt => { // find & re-init entity

						if (voxelEnt.id == data.entityId) {
							// console.log("got component tool message", data.entity.components); // concat with existing components array
							voxelEnt.components = voxelEnt.components.concat(data.entity.components)
							voxelEnt.init(three.scene)
						}

					})
				break;
				case "Custom Tool":

				break
				case "Voxel Tool":

				break
				case "System Tool":
					chunk.entities.map(voxelEnt => { // find & re-init entity

						if (voxelEnt.id == data.entityId) {
							console.log("got component tool message", data.entity.components) // concat with existing components array
							//voxelEnt.components = voxelEnt.components.concat(data.entity.components)
							//voxelEnt.init(three.scene)
						}

					})
				break
				case "Geometry Tool":
					chunk.entities.map(voxelEnt => { // find & re-init entity

						if (voxelEnt.id == data.entityId) {
							console.log("got component tool message", data.entity.components) // concat with existing components array
							//voxelEnt.components = voxelEnt.components.concat(data.entity.components)
							//voxelEnt.init(three.scene)
						}

					})
				break
				case "Material Tool":
					chunk.entities.map(voxelEnt => { // find & re-init entity

						if (voxelEnt.id == data.entityId) {
							console.log("got component tool message", data.entity.components) // concat with existing components array
							//voxelEnt.components = voxelEnt.components.concat(data.entity.components)
							//voxelEnt.init(three.scene)
						}
						
					})
				break
				case "Delete Tool":

				break
				case "Geotag Tool":
					// mostly going to use rest api for this..

				break
			}
			if (world.IOTMode) {
				animate(world, Date.now(), 0)
			}

		})

		socket.on("rtc", packet => {

			let signal = JSON.parse(packet),
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