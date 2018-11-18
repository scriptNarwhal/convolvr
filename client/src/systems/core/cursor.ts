import { GRID_SIZE } from '../../config'
import Convolvr from '../../world/world';
import Component from '../../model/component';
import Entity from '../../model/entity';
import * as THREE from 'three';

let handDirection = new THREE.Vector3(0, 0, 0),
    cameraPos = new THREE.Vector3(0, 0, 0),
    tmpVector2 = new THREE.Vector2(0, 0)

export default class CursorSystem {

    private world: Convolvr;
    private entityCoolDown: number;
    private resetEntityTimeout: number;
    private selectAnimTimeout: number;

    constructor (world: Convolvr) {
        this.world = world
        this.entityCoolDown = -1
        this.resetEntityTimeout = null
        this.selectAnimTimeout = null
    }
    
    public init (component: Component) {
        return {
            distance: 32000
        }
    }

    rayCast (world: Convolvr, camera: any, cursor: any, hand: number, handMesh: any, callback: Function) { // public method; will use from other systems
        let voxels = world.systems.terrain.voxels,
            raycaster = world.raycaster,
            coords = [ 0, 0, 0 ],
            octreeObjects = [],
            castObjects = [],
            intersections = [],
            component = null,
            position = null,
            entity = null,
            obj = null,
            i = 0

        if ( handMesh != null ) {
            handMesh.getWorldDirection( handDirection )
            handDirection.multiplyScalar( -1 )
            position = handMesh.position
        } else {
            camera.getWorldDirection(handDirection)
            cameraPos.fromArray(camera.position.toArray())
            position = cameraPos
        }

        raycaster.set(position, handDirection )
        coords = [ Math.floor( position.x / GRID_SIZE[ 0 ] ), 0, Math.floor( position.z / GRID_SIZE[ 2 ] ) ]
        raycaster.ray.far = 100000
        castObjects = this.getSurroundingVoxels( voxels, coords )
        //octreeObjects = world.octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction )
        intersections = raycaster.intersectObjects( castObjects ) //octreeObjects ) intersectOctreeObjects
        i = intersections.length -1
        component = null

        if ( i > 0 ) { //console.log( i+1, " intersections")
            while ( i > -1 ) {
                obj = intersections[ i ];
                entity = obj.object.userData.entity;
                if (entity &&  entity.hasTag("no-raycast")) { // (entity.componentsByAttr.terrain && entity.allComponents[0].components.length == 0 ||
                    i -= 1
                    continue
                }

                if ( !!entity && obj.distance < 50 ) {
                    if ( entity.components.length == 1 ) { //console.log("raycasting component: ", obj.faceIndex )
                        component = entity.allComponents[ 0 ]; //console.log("one component: ", component ? Object.keys(component.attrs).join("-") : "")
                    } else { 
                        component = entity.getComponentByFace( obj.faceIndex ); //console.log("closest", component ? Object.keys(component.attrs).join("-") : "")
                    }
                }
                callback( cursor, hand, world, obj, entity, component )
                i -= 1
            }

        } else {
            callback( cursor, hand, world, null, null, null )
        }
    }

    getSurroundingVoxels (voxels: any, coords: number[]) {
        let castObjects: any = [],
            key = "",
            x = -1,
            z = -1,
            i = 0

        while (x < 2) {
            while (z < 2) {
                key = [ coords[ 0 ] + x, 0, coords[ 2 ] + z ].join(".")
                if ( typeof voxels[ key ] == 'object') { //console.warn("Empty Voxel! ", key, voxels[ key ] ) }
                    castObjects = castObjects.concat( !!voxels[ key ] ? voxels[ key ].meshes : [] )
                } else {
                    //console.warn(key, 'notloaded')
                }
                z ++
            }
            z = -1
            x ++
        }
        
        if (voxels[ "0.1.0" ] != null)
            castObjects = castObjects.concat(voxels[ "0.1.0" ].meshes )
    
        while (i < castObjects.length) {
            if ( !!!castObjects[ i ] ) {
                castObjects.splice( i, 1 )
            } else {
                i += 1
            }    
        }
        return castObjects
    }

    handleCursors(cursors: any[], cursorIndex: number, hands: any[], camera: any, world: Convolvr) {
        let handMesh: any = null,
            input = world.userInput,
            cursorSystem = world.systems.cursor

        cursors.map((cursor: Component, i: number) => { // animate cursors & raycast scene

            let state = cursor.state.cursor,
                cursorMesh = cursor.mesh;
            
            cursorSystem.animateCursors(world, input, cursorSystem, cursor, cursorMesh, state, i, cursorIndex);
            if (i > 0) { // possibly refactor this to stop hands from lagging behind at high speed*
                handMesh = cursors[i].mesh.parent
                !!handMesh && handMesh.updateMatrix()
            }

            if (i == cursorIndex) // ray cast from one cursor at a time to save CPU
                cursorSystem.rayCast(world, camera, cursor, i -1, handMesh, cursorSystem.cursorCallback)

        });

        if ( cursorSystem.entityCoolDown  > -3 )
            cursorSystem.entityCoolDown -= 2

        cursorIndex += 1

        if ( cursorIndex == cursors.length )
            cursorIndex = 0

        return cursorIndex
    }

    private cursorCallback(cursor: any, hand: number, world: Convolvr, obj: any, entity: Entity, component: Component) {
        let cursorState = cursor.state,
            distance = !!cursorState.cursor ? cursorState.cursor.distance : 2,
            attrs = !!component ? component.attrs : false,
            hover = !!attrs ? attrs.hover : false,
            lookAway = !!attrs ? attrs.lookAway : false,
            activate = !!attrs ? attrs.activate : false,
            cursorSystem = world.systems.cursor,
            newCursorState: any = null,
            noRayCast = entity && entity.componentsByAttr.noRayCast,
            callbacks = null,
            comp = false,
            cb = 0

        if (!!obj) {
            if ( !!!cursorState.cursor.entity && !!! noRayCast )
                window.navigator.vibrate && window.navigator.vibrate(25)

                newCursorState = {
                distance: obj.distance || 2,
                mesh: obj.object,
                point: obj.point,
                faceIndex: obj.faceIndex,
                component,
                componentPath: component ? component.path : []
            }
        } else {
            newCursorState = {
                distance: 2,
                mesh: null,
                point: null,
                faceIndex: -1,
                componentPath: [],
            }
        }

        newCursorState.entity = noRayCast ? cursorState.cursor.entity : entity
        newCursorState.lookingAtEntity = noRayCast ? cursorState.cursor.entity : entity
        //_changeCursorColor( cursor, newCursorState.entity && newCursorState.entity.componentsByAttr.terrain == null )
        if ( !!!component && cursorState.cursor.component ) {
            if ( lookAway ) {
                callbacks = cursorState.component.state.lookAway.callbacks
                cb = callbacks.length - 1
                while ( cb >= 0 ) {
                        callbacks[ cb ]()
                        cb --
                }
            }
        }

        cursorState.cursor = Object.assign( {}, newCursorState )

        if ( !!entity && !!component ) 
            if ( hover ) {
                callbacks = component.state.hover.callbacks
                cb = callbacks.length - 1
                while ( cb >= 0 ) {
                    callbacks[ cb ]()
                    cb --
                }
            }
    }

    private animateCursors(world: Convolvr, input: any, cursorSystem: CursorSystem, cursor: any, cursorMesh: any, state: any, i: any, cursorIndex: number) {
        let cursorState = cursor.state.cursor,
            cursorPos = cursorMesh.position,
            cursorSpeed = (cursorState.speed || 0 +(cursorState.speed || 0 +( state.distance - cursorPos.z ) / 8) / 2.0)/2.0,
            trackedControls = ( world.mode == "stereo" && input.trackedControls || input.leapMotion )
            
        cursorSpeed *= state.entity ? 1 : 0.9;
        cursorState.speed = cursorSpeed;

        cursorMesh.updateMatrix()
        cursorMesh.updateMatrixWorld()
        if ( i == 0 ) { // head cursor
            if ( trackedControls && cursorMesh.visible == true ) {
                cursorMesh.visible = false
            } else if ( !trackedControls && cursorMesh.visible == false ) {
                cursorMesh.visible = true
            }

        } else if ( i > 0 ) { // hands
            if ( trackedControls && cursorMesh.visible == false ) {
                cursorMesh.visible = true
            } else if ( !trackedControls && cursorMesh.visible ) {
                cursorMesh.visible = false
            }
        }

        if ( !!state ) { // animate cursor (in / out)
            if ( state.distance-0.33 < (-cursorPos.z) && (cursorPos.z < 4 - cursorSpeed) ) { // near bound of allowed movement
                cursorPos.z += cursorSpeed;
            } else if ( state.distance-0.33 > (-cursorPos.z) && (cursorPos.z > -3 + cursorSpeed) ) { // far bound of allowed movement
                cursorPos.z -= cursorSpeed;
            }
        }
    }

    private snapToComponent(mesh: any, component: Component, entity: Entity) {

        // implement

    }
}

var cursorColorTimeouts: any[] = [];

function _changeCursorColor ( cursor: Component, selected: boolean ) {
    let cursorColor = cursor.mesh.material.color;
    cursorColorTimeouts.forEach( c=> clearTimeout( c ) )
    cursorColorTimeouts = [
        setTimeout(() => {
            cursorColor.set( selected ? 0x00ff00 : 0xf5f5f5 )
        }, 150)
    ]
}