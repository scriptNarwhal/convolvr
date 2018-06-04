import Component from '../../core/component'
import Convolvr from '../../world/world'
import { Vector3 } from 'three';
export default class HandSystem {

    world: Convolvr

    constructor(world: Convolvr) {
        this.world = world
    }

    init (component: Component) {
        let userInput = this.world.userInput

        if ( component.attrs.hand == undefined || component.attrs.hand != undefined && userInput.trackedControls == false && userInput.leapMotion == false) {
            setTimeout(()=>{
                this.toggleTrackedHands( component, false )
            }, 1500)
        }

        return {
            trackedHands: false,
            toggleTrackedHands: (toggle = true) => {
                this.toggleTrackedHands( component, toggle )
            },
            grip: (value: number): number => {
                return this.grip(component, value)
            },
            setHandOrientation: (position: number[], rotation: number[]) => {
                this.setHandOrientation(component, position, rotation)
            }
        }
    }

    grip(component: Component, value: number): number {
        let avatar = component.entity,
            cursors = !!avatar ? avatar.componentsByAttr.cursor : false,
            cursorMesh = null,
            entity = null, //hand.children[0].userData.component.attrs.,
            cursor = null,
            state = null,
            handPos = [0, 0, 0],
            avatarPos = [0, 0, 0],
            oldVoxel = [0, 0, 0];

        if ( component ) {
            state = component.state
            if ( state.hand.trackedHands && cursors ) {
                cursor = component.allComponents[ 0 ];
            } else {
                cursor = cursors[ 0 ];
            }
            cursorMesh = cursor.mesh;
        }

        if (cursor && cursorMesh != null && state != null) {
            avatarPos = component.entity.mesh.position
            if (Math.round(value) == 1) { // console.info("grab")
                entity = cursor.state.cursor.entity

                if (!!entity && !!!state.hand.grabbedEntity) {
                    let zPosition = entity.boundingRadius || 15;
                    
                    this.world.three.scene.remove(entity.mesh);
                    state.hand.grabbedEntity = entity; 
                    entity.addTag("no-raycast");
                   
                    entity.mesh.position.fromArray([0, 0, 0]);
                    entity.mesh.quaternion.fromArray([0, 0, 0, 1]);
                    if (state.hand.trackedHands) {
                        component.mesh.add(entity.mesh);
                    } else {
                        cursorMesh.add(entity.mesh);
                        entity.mesh.updateMatrix();
                        console.warn("bounding radius", entity.boundingRadius);
                       
                        entity.mesh.position.y -= zPosition;
                    }
                    entity.mesh.updateMatrix();
                }
            } else {
                if (state.hand.grabbedEntity) {
                    
                    entity = state.hand.grabbedEntity

                    if (entity) {
                        oldVoxel = [...entity.voxel];
                        entity.removeTag("no-raycast");
                        if (state.hand.trackedHands) {
                            component.mesh.remove(entity.mesh);
                            handPos = component.mesh.position
                            entity.update( (handPos as any).toArray(), component.mesh.quaternion.toArray())
                            // entity.mesh.translateZ(-entity.boundingRadius)
                        } else {
                            cursorMesh.remove(entity.mesh);
                            //  let newEntPos = (avatarPos as any).toArray();
                            let newEntPos = cursorMesh.getWorldPosition();
                            //  newEntPos[2] += cursorMesh.position.z;
                            entity.update(newEntPos.toArray(), avatar.mesh.quaternion.toArray());
                            entity.mesh.translateZ(-entity.boundingRadius); //+cursorMesh.position.z)
                            entity.update(entity.mesh.position.toArray());
                        }
                        this.world.three.scene.add(entity.mesh);
                        
                        entity.mesh.updateMatrix()
                        entity.position = entity.mesh.position.toArray()
                        entity.getVoxel( true, true )
                        entity.save( oldVoxel )
                        state.hand = Object.assign({}, state.hand, { grabbedEntity: false })
                        return entity.id;
                    }
                }
                return -1;
            }
        }
        return -1;
    }

    setHandOrientation(component: Component, position: number[], rotation: number[]) {
        let mesh = component.mesh;

        if (mesh && mesh.position != null) {
            mesh.autoUpdateMatrix = false;
            mesh.position.fromArray(position).add(this.world.camera.position);
            mesh.position.y += this.world.settings.floorHeight
            mesh.quaternion.fromArray(rotation);
            mesh.updateMatrix();
        }
    }

    toggleTrackedHands(component: Component, toggle: boolean = true) {
        let scene = this.world.three.scene,
            avatar = component.entity,
            position: any = null,
            cursors = avatar.componentsByAttr.cursor,
            hands = avatar.componentsByAttr.hand;

        if (!avatar || !avatar.mesh) {
            console.warn("toggleTrackedHAnds FaileD!!")
            console.warn("No avatar entity for hand.toggleTrackedHands()")
            return
        } else {
            position = avatar.mesh.position
            cursors = avatar.componentsByAttr.cursor,
            hands = avatar.componentsByAttr.hand
        }

      if (cursors) {
       cursors[0].mesh.visible = !toggle
      }

      hands.map((handComponent: Component, i: number) => {
        let hand = handComponent.mesh,
            handState = handComponent.state.hand;

        if (hand == null || hand.position == null) {
            return
        }
        if (toggle && handState.trackedHands == false) {
            //this.headMountedCursor.mesh.visible = false // activate under certain conditions..
            if (hand.parent) {
                hand.parent.remove(hand)
            } else {
                console.info("hand ", i, "not attached to anything yet")
            }
            scene.add(hand)
            if (hand.position != null && hand.children != null) {  
                hand.position.set(position.x -0.7+ i*1.4, position.y -0.4, position.z -0.5)
                if (i > 0) {
                    if ( !!hand.children[0] ) {
                        hand.children[0].visible = true
                    }
                }
            }
            handState.trackedHands = toggle

        } else if (handState.trackedHands) {
            avatar.mesh.add(hand)
            if ( i > 0 ) {
              if ( !!hand.children[0] ) {
                hand.children[0].visible = false
              }
            }
            hand.position.set(-0.7+ i*1.4, -0.35, -0.25)
            handState.trackedHands = toggle
        }
        hand.updateMatrix()
      })
    }
}

