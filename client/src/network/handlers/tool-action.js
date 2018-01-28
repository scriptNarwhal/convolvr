import { animate } from '../../world/render'
import { GRID_SIZE } from '../../config'
import Avatar from '../../assets/entities/avatars/avatar'
import Entity from '../../entity'

export default class ToolActionHandler {

    constructor( handlers, world, socket ) {

        this.world = world
        this.handlers = handlers

        socket.on("tool action", packet => {
            let data = JSON.parse(packet.data),
                world = this.world,
                user = world.user,
                avatar = null,
                pos = data.position,
                coords = data.coords,
                voxel = world.terrain.voxels[coords[0] + ".0." + coords[2]],
                quat = data.quaternion,
                remoteUser = {},
                userHand = {}

            if ( voxel == null || voxel.loaded == false ) {
                if (voxel)
                    world.systems.terrain.loadVoxel(coords)

                console.warn("[Remote] Voxel not loaded", coords)
                return
            }

            switch ( data.tool ) {
                case "Entity Tool":
                    let ent = data.entity,
                        entity = new Entity(ent.id, ent.components, data.position, data.quaternion, coords)

                    voxel.entities.push(entity)
                    entity.init(three.scene)
                    break
                case "Component Tool":
                    voxel.entities.map(voxelEnt => { // find & re-init entity
                        if (voxelEnt.id == data.entityId) // console.log("got component tool message", data.entity.components); // concat with existing components array
                            voxelEnt.update(false, false, voxelEnt.components.concat(data.entity.components), false, false, { ignoreRotation: true })

                    })
                    break;
                case "Custom Tool":
                    // check tool functionality from tool prop
                    break
                case "Voxel Tool":

                    break
                case "Update Tool":
                    voxel.entities.map(voxelEnt => { // find & re-init entity.. also probably look up the right component to modify by id *******************
                        if (voxelEnt.id == data.entityId) {
                            //console.log("Update Tool message", data.components[0]) // concat with existing components array
                            voxelEnt.update(false, false, false, data.components[0], data.componentPath, { ignoreRotation: true })
                        }
                    })
                    break
                case "Delete Tool":
                    voxel.entities.map((voxelEnt, i) => { // find & re-init entity ^^^^^^
                        if (voxelEnt.id == data.entityId) {
                            console.log("got delete tool message", data.entityId) // concat with existing components array
                            world.octree.remove(voxelEnt.mesh)
                            three.scene.remove(voxelEnt.mesh)
                            voxel.entities.splice(i, 1)
                        }
                    })
                    break
                case "Geotag Tool":
                    // mostly going to use rest api for this..

                    break
                case "Grab Entity":
                console.log("Network Grab Entity: data.user", data.user, "user.name", user.name)
                    if (data.user != user.name) {
                
                    console.log("Network Grab Entity: actually replacing")
                        remoteUser = world.users["user" + data.userId]
                        userHand = remoteUser.avatar.componentsByProp.hand[data.hand]
                        voxel.entities.map(voxelEnt => {
                            if (voxelEnt.id == data.entityId) {
                                three.scene.remove(voxelEnt.mesh)
                                userHand.state.hand.grabbedEntity = voxelEnt
                                voxelEnt.updateOldCoords()
                                userHand.mesh.add(voxelEnt.mesh)
                                voxelEnt.mesh.position.fromArray([0, 0, -voxelEnt.boundingRadius])
                                voxelEnt.mesh.quaternion.fromArray([0, 0, 0, 1])
                                voxelEnt.mesh.updateMatrix()
                                console.log("grab entity: found entity")
                            }
                        })
                    }
                    break
                case "Replace Entity":
                
                console.log("Network Replace Entity: data.user", data.user, "user.name", user.name)
                   
                    if (data.user != user.name) {
                        console.log("Network Replace Entity: actually replacing")
                        remoteUser = world.users["user" + data.userId],
                            avatar = remoteUser.avatar,
                            userHand = avatar.componentsByProp.hand[data.hand]

                        let handState = userHand.state.hand,
                            voxelEnt = handState.grabbedEntity,
                            handPos = []

                        if (voxelEnt) {
                            if (handState.trackedHands) {
                                handPos = userHand.mesh.position
                                entity.update(handPos.toArray(), userHand.mesh.quaternion.toArray())
                            } else {
                                avatarPos = avatar.mesh.position
                                entity.update(avatarPos.toArray(), avatar.mesh.quaternion.toArray())
                            }
                            voxelEnt.mesh.translateZ(-voxelEnt.boundingRadius)
                            voxelEnt.mesh.updateMatrix()
                            voxelEnt.position = voxelEnt.mesh.position.toArray()
                            voxelEnt.getVoxel()
                        } else {
                         console.warn("no voxel ent to replace")
                        }
                    }
                    break
            }

            if (world.settings.IOTMode)
                animate(world, Date.now(), 0)

        })
    }
}

