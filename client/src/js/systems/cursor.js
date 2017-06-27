let handDirection = new THREE.Vector3(0, 0, 0),
    tmpVector2 = new THREE.Vector2(0, 0)

export default class CursorSystem {
    constructor ( world ) {

        this.world = world
        this.entityCoolDown = -1
        this.resetEntityTimeout = null

    }

    init ( component ) {
         
        return {
            distance: 32000
        }
    }

    rayCast ( world, camera, cursor, hand, handMesh, callback ) { // public method; will use from other systems

        let raycaster = world.raycaster,
            eventsToChildren = false,
            octreeObjects = [],
            castObjects = [],
            intersections = [],
            component = null,
            voxels = world.systems.terrain.voxels,
            coords = [ 0, 0, 0 ],
            key = "",
            position = null,
            entity = null,
            obj = null,
            x = -1,
            z = -1,
            i = 0

        if ( handMesh != null ) {

            handMesh.getWorldDirection( handDirection )
            handDirection.multiplyScalar( -1 )
            position = handMesh.position
            raycaster.set( handMesh.position, handDirection )

        } else {

            position = camera.position
            raycaster.setFromCamera( tmpVector2, camera )

        }

        coords = ([Math.floor( position.z / 928000 ), 0, Math.floor( position.z / 807360 )])

        raycaster.ray.far = 80000

        while ( x < 2 ) {
            
            while ( z < 2 ) {

                key = [ coords[0] + x, 0, coords[2] + z ].join(".")

                castObjects = castObjects.concat( !!voxels[ key ] ? voxels[ key ].meshes : [] )
                z ++
            }

            z = -1
            x ++

        }
        
        if ( voxels[ "0.0.0" ] != null ) {
            castObjects = castObjects.concat(voxels[ "0.0.0" ].meshes )
        }

       while ( i < castObjects.length ) {

             if ( !!!castObjects[ i ] ) {

                castObjects.splice( i, 1 )

            } else {

                i += 1
            
            }
            
       }

        //octreeObjects = world.octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction )
        intersections = raycaster.intersectOctreeObjects( castObjects ) //octreeObjects )

        i = intersections.length -1
        component = null

        while ( i > -1 ) {

            obj = intersections[i]
            entity = obj.object.userData.entity
            if (!! entity && entity.componentsByProp.terrain ) {
                i --
                continue
            }
            if ( !!entity && obj.distance < 90000 ) {

                if ( entity.components.length == 1 ) { //console.log("raycasting component: ", obj.faceIndex )

                    component = entity.allComponents[0]; //console.log("one component: ", component ? Object.keys(component.props).join("-") : "")

                } else { 

                    component = entity.getClosestComponent( obj.point ); //console.log("closest", component ? Object.keys(component.props).join("-") : "")

                }

            }

            callback( cursor, hand, world, obj, entity, component )
            i --

        }

    }

    handleCursors ( cursors, cursorIndex, hands, camera, world ) {

        let handMesh = null,
            input = world.userInput,
            cursorSystem = world.systems.cursor,
            trackedControls = (input.trackedControls || input.leapMotion)

        cursors.map(( cursor, i ) => { // animate cursors & raycast scene

            let state = cursor.state.cursor,
                cursorMesh = cursor.mesh,
                cursorPos = cursorMesh.position,
                cursorSpeed = (state.distance - cursorPos.z) / 10
            
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

                if ( state.distance-8000 < (-cursorPos.z) && (cursorPos.z < 88000 - cursorSpeed) ) { // near bound of allowed movement

                    cursorPos.z += cursorSpeed

                } else if ( state.distance-8000 > (-cursorPos.z) && (cursorPos.z > -88000 + cursorSpeed) ) { // far bound of allowed movement
                
                    cursorPos.z -= cursorSpeed
                
                }
            }

            cursorMesh.updateMatrix()
            cursorMesh.updateMatrixWorld()

            if ( i > 0 ) { // possibly refactor this to stop hands from lagging behind at high speed*

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
            distance = !!cursorState.cursor ? cursorState.cursor.distance : 28000,
            props = !!component ? component.props : false,
            hover = !!props ? props.hover : false,
            lookAway = !!props ? props.lookAway : false,
            activate = !!props ? props.activate : false,
            comp = false,
            cursorSystem = world.systems.cursor,
            newCursorState = {
                distance: 28000,
                mesh: obj.object,
                point: obj.point,
                faceIndex: obj.faceIndex,
                component
            }

        if ( !!entity || ( cursorSystem.entityCoolDown < 0 && !!!entity ) ) { 
            
            newCursorState.entity = entity

        } else {

            newCursorState.entity = cursorState.cursor.entity

        }

        if ( !!obj.distance )

            newCursorState.distance = obj.distance


        if ( !!cursorState.component && !!!component && lookAway) {
         
            callbacks = cursorState.component.state.lookAway.callbacks
            cb = callbacks.length-1

            while ( cb >= 0 ) {

                callbacks[cb]()
                cb --

            }

        }

        cursorState.cursor = Object.assign( { faceIndex: -1 }, newCursorState )

        if ( !!entity && !!component ) {

            if ( hover ) {

                callbacks = component.state.hover.callbacks
                cb = callbacks.length-1

                while ( cb >= 0 ) {

                    callbacks[cb]()
                    cb --

                }

            }

        }

    }

    _updatePreview ( mesh, type, data ) {

        // implement

    }

    _snapToComponent( mesh, component, entity ) {

        // implement

    }
}