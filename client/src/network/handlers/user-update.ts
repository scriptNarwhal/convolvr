//@flow
import { animate } from '../../world/render'
import { GRID_SIZE, GLOBAL_SPACE } from '../../config'
import Avatar from '../../assets/entities/avatars/avatar'
import Entity from '../../core/entity';
import Voxel from '../../core/voxel';
import Convolvr from '../../world/world';

export default class UserUpdateHandler {

    world: Convolvr
    handlers: any

    constructor( handlers: any, world: Convolvr, socket: any ) {
        this.world = world
        this.handlers = handlers
        socket.on("update", (packet: any) => {
            let data = JSON.parse(packet.data),
                world = this.world,
                voxels = (world.systems.terrain as any).voxels,
                coords = world.getVoxel(data.position),
                cameraCoords = world.getVoxel(),
                closeToCamera = Math.abs(cameraCoords[0] - coords[0]) < 3 && Math.abs(cameraCoords[2] - coords[2]) < 3,
                userVoxel = null,
                update = null,
                avatar = null,
                user = null,
                pos = null,
                quat = null,
                mesh = null,
                hands = [];

            if (!!data.entity && (world.terrain as any).loaded) {
        
                update = data.entity
                
                if (update.id != world.user.id) { //  && closeToCamera == false 
                    coords = [].concat(GLOBAL_SPACE);
                    userVoxel = voxels[coords[0] + '.0.' + coords[2]]
                    pos = update.position
                    quat = update.quaternion
                    user = (world.users as any)["user" + update.id]
                    if (user == null) {
                        this.loadPlayerAvatar(update, userVoxel, coords, data)
                    } else if (user && user.mesh) {
                        if (update.hands.length > 0) {
                            hands = user.avatar.componentsByAttr.hand
                            for (let h = 0, nHands = hands.length; h < nHands; h += 1) {
                                let hand = hands[h];

                                hand.mesh.position.fromArray(update.hands[h].pos)
                                hand.mesh.quaternion.fromArray(update.hands[h].quat)
                                hand.mesh.updateMatrix()
                            }
                            // toggle tracked hands?
                            // let's attempt to..
                            hands[0].state.hand.toggleTrackedHands(true)
                        }
                        user.avatar.update([pos.x, pos.y, pos.z], [quat.x, quat.y, quat.z, quat.w], false, false, false, { updateWorkers: false })
                    }
                }
            }
        })
    }

    loadPlayerAvatar(entity: any, userVoxel: Voxel, coords: number[], data: any ) {
        if ( this.isEntityLoaded( entity.avatar ) ) {
            console.log("entity is loaded")
            this.addAvatarToVoxel(entity, userVoxel, coords, data )
        } else {
            console.log("entity is not loaded")
            if ( !!!this.world.systems.assets.loadingItemsById.entities[ entity.avatar ] ) {
                this.world.systems.assets.loadInventoryEntity(entity.username, entity.avatar).then(()=>{
                    console.info("loadPlayerAvatar loadInventory callback")
                   // this.world.systems.assets.userEntities
                    this.addAvatarToVoxel(entity, userVoxel, coords, data )
                })
            }
        }
    }

    addAvatarToVoxel(entity: any, userVoxel: Voxel, coords: number[], data: any ) {
        console.log("add avatar to voxel data:", entity)
        let world = this.world,
            avatar = world.systems.assets.makeEntity(entity.avatar, true, { wholeBody: true, userName: entity.username, id: entity.id }, coords),
            user = (world.users as any)["user" + entity.id] = {
                id: entity.id,
                avatar,
                mesh: null as any
            }

        if (userVoxel == null) {
            console.warn("[Remote] Voxel not loaded", coords)
            world.systems.terrain.loadVoxel(coords, (loadedVoxel: Voxel) => { this.initPlayerAvatar(avatar, user, data) })
        } else if (userVoxel.loaded == false && userVoxel.fetching == false) {
            console.info("[Remote] Voxel being loaded...", coords)
            userVoxel.fetchData((loadedVoxel: Voxel) => { this.initPlayerAvatar(avatar, user, data) })
        } else if (userVoxel.fetching) {
            console.info("[Remote] Voxel already fetching...", coords)
            setTimeout(() => {
                this.initPlayerAvatar(avatar, user, data)
            }, 1000)
        } else {
            this.initPlayerAvatar(avatar, user, data)
        }
    }

    initPlayerAvatar(avatar: Entity, newUser: any, newData: any) {
        console.log("initPlayerAvatar")
        console.info("[Remote] User avatar init")
        avatar.init(this.world.three.scene)
        newUser.mesh = avatar.mesh

        if (newData.entity.hands.length > 0)
            setTimeout(() => {
                avatar.componentsByAttr.hand[1].state.hand.toggleTrackedHands(true)
            }, 1000)
    }

    isEntityLoaded(entityName: string) {
        let assets = this.world.systems.assets
        
        return assets.isEntityLoaded( entityName )   
    }
}