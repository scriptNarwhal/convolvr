import Avatar from '../world/avatar'

export default class SocketHandlers {
    constructor (world, socket) {
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
							avatar: new Avatar(entity.id, true, {}), // render whole body, not just hands
							mesh: null
						}
					}
					user.mesh = user.avatar.mesh;
					mesh = user.mesh
					if (!! mesh) {
						mesh.position.set(pos.x, pos.y, pos.z)
						mesh.quaternion.set(quat.x, quat.y, quat.z, quat.w)
					}
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
				break;
				case "Component Tool":
					chunk.entities.map(voxelEnt => { // find & re-init entity
						if (voxelEnt.id == data.entityId) {
							console.log("got component tool message") // concat with existing components array
							console.log(data.entity.components)
							voxelEnt.components = voxelEnt.components.concat(data.entity.components)
							voxelEnt.init(three.scene)
						}
					})
				break;
				case "Voxel Tool":

				break;
				case "Projectile Tool":

				break;
				case "Delete Tool":

				break;
			}
		})
    }

    
}