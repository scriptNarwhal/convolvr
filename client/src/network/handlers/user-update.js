import { animate } from '../../world/render'
import { GRID_SIZE } from '../../config'
import Avatar from '../../assets/entities/avatars/avatar'
import Entity from '../../entity'

export default class UserUpdateHandler {

    constructor( handlers, world, socket ) {

        this.world = world
        this.handlers = handlers
        socket.on("update", packet => {
            let data = JSON.parse(packet.data),
                world = this.world,
                voxels = world.systems.terrain.voxels,
                coords = world.getVoxel(data.position),
                cameraCoords = world.getVoxel(),
                closeToCamera = Math.abs(cameraCoords[0] - coords[0]) < 3 && Math.abs(cameraCoords[2] - coords[2]) < 3,
                userVoxel = null,
                entity = null,
                avatar = null,
                user = null,
                pos = null,
                quat = null,
                mesh = null,
                hands = [],
                hand = null,
                h = 0

            if (!!data.entity && world.terrain.loaded) {
                entity = data.entity
                userVoxel = voxels[coords[0] + '.0.' + coords[2]]
                if (entity.id != world.user.id) { //  && closeToCamera == false 
                    pos = entity.position
                    quat = entity.quaternion
                    user = world.users["user" + entity.id]
                    if (user == null) {
                        this.loadPlayerAvatar( entity, userVoxel, coords, data )
                    } else if (user && user.mesh) {
                        if (data.entity.hands.length > 0) {
                            hands = user.avatar.componentsByProp.hand
                            while (h < hands.length) {
                                hand = hands[h]
                                hand.mesh.position.fromArray(data.entity.hands[h].pos)
                                hand.mesh.quaternion.fromArray(data.entity.hands[h].quat)
                                hand.mesh.updateMatrix()
                                h += 1
                            }
                        }
                        user.avatar.update([pos.x, pos.y, pos.z], [quat.x, quat.y, quat.z, quat.w], false, false, false, { updateWorkers: false })
                    }
                }
            }
        })
    }

    loadPlayerAvatar ( entity, userVoxel, coords, data ) {

        if ( this.isEntityLoaded( entity.avatar ) ) {
            console.log("entity is loaded")
            this.addAvatarToVoxel( entity, userVoxel, coords, data )
        } else {
            console.log("entity is not loaded")
            if ( !!!this.world.systems.assets.loadingItemsById.entities[ entity.avatar ] ) {
                this.world.systems.assets.loadInventoryEntity( entity.username, entity.avatar).then(()=>{
                    console.info("loadPlayerAvatar loadInventory callback")
                   // this.world.systems.assets.userEntities
                    this.addAvatarToVoxel( entity, userVoxel, coords, data )
                })
            }
        }
    }

    addAvatarToVoxel ( entity, userVoxel, coords, data ) {
        console.log("add avatar to voxel")
        let world = this.world,
            avatar = world.systems.assets.makeEntity(entity.avatar, true, { wholeBody: true, id: entity.id }, coords),
            user = world.users["user" + entity.id] = {
                id: entity.id,
                avatar,
                mesh: null
            }

        if (userVoxel == null) {
            console.warn("[Remote] Voxel not loaded", coords)
            world.systems.terrain.loadVoxel(coords, loadedVoxel => { this.initPlayerAvatar(avatar, user, data) })
        } else if (userVoxel.loaded == false && userVoxel.fetching == false) {
            console.info("[Remote] Voxel being loaded...", coords)
            userVoxel.fetchData(loadedVoxel => { this.initPlayerAvatar(avatar, user, data) })
        } else if (userVoxel.fetching) {
            console.info("[Remote] Voxel already fetching...", coords)
            setTimeout(() => {
                this.initPlayerAvatar(avatar, user, data)
            }, 1000)
        } else {
            this.initPlayerAvatar(avatar, user, data)
        }
    }

    initPlayerAvatar (avatar, newUser, newData) {
        console.log("initPlayerAvatar")
        console.info("[Remote] User avatar init")
        avatar.init(window.three.scene)
        newUser.mesh = avatar.mesh

        if (newData.entity.hands.length > 0)
            setTimeout(() => {
                avatar.componentsByProp.hand[1].state.hand.toggleTrackedHands(true)
            }, 1000)
    }

    isEntityLoaded ( entityName ) {
        let assets = this.world.systems.assets
        
        return assets.isEntityLoaded( entityName )   
    }
}