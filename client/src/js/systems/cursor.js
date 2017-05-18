let handDirection = new THREE.Vector3(0, 0, 0),
    tmpVector2 = new THREE.Vector2(0, 0)

export default class CursorSystem {
    constructor ( world ) {

        this.world = world
        this.entityCoolDown = -1

    }

    init ( component ) {
         
        return {
            distance: 18000
        }
    }

    rayCast ( world, camera, cursor, hand, handMesh, callback ) { // public method; will use from other systems

        let raycaster = world.raycaster,
            octreeObjects = [],
            intersections = [],
            component = null,
            entity = null,
            obj = null,
            i = 0

        if ( handMesh != null ) {

            handMesh.getWorldDirection( handDirection )
            handDirection.multiplyScalar( -1 )
            raycaster.set( handMesh.position, handDirection )

        } else {

            raycaster.setFromCamera( tmpVector2, camera )

        }

        octreeObjects = world.octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction )
        intersections = raycaster.intersectOctreeObjects( octreeObjects )
        i = intersections.length -1

        while ( i > -1 ) {

            obj = intersections[i]
            entity = obj.object.userData.entity
            component = obj.object.userData.component
            callback( cursor, hand, world, obj, entity, component )
            i --

        }

    }

    handleCursors ( cursors, cursorIndex, hands, camera, world ) {

        let handMesh = null,
            input = world.userInput,
            cursorSystem = world.systems.cursor

        cursors.map(( cursor, i ) => { // animate cursors & raycast scene

            let state = cursor.state.cursor,
                cursorMesh = cursor.mesh,
                cursorPos = cursorMesh.position,
                cursorSpeed = (state.distance - cursorPos.z) / 10
            
            if ( i == 0 ) { // head cursor
                
                if ( cursorMesh.visible == true && (input.trackedControls || input.leapMotion) ) {

                    cursorMesh.visible = false

                } else if ( cursorMesh.visible == false && (!input.trackedControls && !input.leapMotion) ) {

                    cursorMesh.visible = true

                }

            } else if ( i > 0 ) { // hands

                if ( cursorMesh.visible == false && (input.trackedControls || input.leapMotion) ) {

                    cursorMesh.visible = true

                } else if ( cursorMesh.visible && (!input.trackedControls && !input.leapMotion) ) {

                    cursorMesh.visible = false

                }

            }

            if ( !!state ) { // animate cursor (in / out)

                if ( state.distance-8000 < (-cursorPos.z) && (cursorPos.z < 80000 - cursorSpeed) ) { // near bound of allowed movement

                    cursorPos.z += cursorSpeed

                } else if ( state.distance > (-cursorPos.z) && (cursorPos.z > -80000 + cursorSpeed) ) { // far bound of allowed movement
                
                    cursorPos.z -= cursorSpeed
                
                }
            }

            cursorMesh.updateMatrix()
            cursorMesh.updateMatrixWorld()

            if ( i > 0 ) {

                handMesh = cursors[i].mesh.parent
                !!handMesh && handMesh.updateMatrix()

            }

            if ( i == cursorIndex ) { // ray cast from one cursor at a time to save CPU
                
                cursorSystem.rayCast( world, camera, cursor, i -1, handMesh, cursorSystem._cursorCallback )

            }

        })


        if ( cursorSystem.entityCoolDown  > -3 ) {
        
            cursorSystem.entityCoolDown -= 2

        }

        cursorIndex ++

        if ( cursorIndex == cursors.length ) {

            cursorIndex = 0

        }

        return cursorIndex

    }

    _cursorCallback ( cursor, hand, world, obj, entity, component ) {

        let cb = 0,
            callbacks = [],
            cursorState = cursor.state,
            distance = !!cursorState.cursor ? cursorState.cursor.distance: 12000,
            props = !!component ? component.props : false,
            hover = !!props ? props.hover : false,
            activate = !!props ? props.activate : false,
            cursorSystem = world.systems.cursor,
            newCursorState = {
                distance,
                mesh: obj.object,
                component
            }

        distance = obj.distance

        if ( !! entity && distance < 165000 ) {

            cursorSystem.entityCoolDown = 45

        }

        if ( ( cursorSystem.entityCoolDown > 0 && !!entity ) || ( cursorSystem.entityCoolDown < 0 && !!!entity ) ) { // if components are spawned in rapid succession, attach them to the current entity even if not pointing at it

            newCursorState.entity = entity

        }

        if ( !!obj.distance ) {

            newCursorState.distance = obj.distance

        }

        // if ( !! newCursorState.entity ) { console.log(JSON.stringify(newCursorState.entity.components)) }

        cursor.state.cursor = Object.assign( {}, cursorState.cursor, newCursorState )

        if ( !!entity && !!component ) {

            if ( hover ) {

                callbacks = component.state.hover.callbacks
                cb = callbacks.length-1

                while (cb >= 0) {

                    callbacks[cb]()
                    cb --

                }

            }

            if ( activate ) {

                callbacks = component.state.activate.callbacks // check if cursor / hand is activated
                cb = callbacks.length-1

                while ( cb >= 0 ) {

                    callbacks[cb]()
                    cb --

                }

            }

        }

    }
}