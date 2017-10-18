export default class HandSystem {

    constructor ( world ) {
        this.world = world
    }

    init ( component ) {
         
        let userInput = this.world.userInput

        if ( component.props.hand == undefined || component.props.hand != undefined && userInput.trackedControls == false && userInput.leapMotion == false) {

            setTimeout(()=>{

                this.toggleTrackedHands( component, false )

            }, 500)

        }
    
        return {
            toggleTrackedHands: ( toggle = true ) => {
                this.toggleTrackedHands( component, toggle )
            },
            grip: ( value ) => {
                this.grip( component, value )
            },
            setHandOrientation: ( position, rotation, index ) => {
                this.setHandOrientation( component, position, rotation, index )
            }
        }
    }

    grip( component, value ) {

        let entity = null, //hand.children[0].userData.component.props.,
            cursor = null,
            state = null,
            pos = [0, 0, 0] //entity.mesh.position,

        if ( component ) {

            cursor = component.allComponents[0]
            state = component.state

        }

        if ( cursor ) {

            
            console.info("grab", value, "userData", state.hand)

                if ( Math.round(value) == -1 && state.hand.grabbedEntity ) {

                    console.info("Let Go")
                    entity = state.hand.grabbedEntity
                    
                    if ( entity ) {

                        component.mesh.remove(entity.mesh)
                        three.scene.add(entity.mesh)
                        entity.update([component.mesh.position.x, component.mesh.position.y, component.mesh.position.z])
                        state.hand = Object.assign({}, state.hand, {grabbedEntity: false})

                    }

                } else {

                    entity = cursor.state.cursor.entity

                }
                
                pos = !!entity ? entity.mesh.position.toArray() : pos

                if ( !!entity && !!!state.hand.grabbedEntity ) {

                    console.info("Pick Up")
                    three.scene.remove(entity.mesh)
                    state.hand.grabbedEntity = entity
                    component.mesh.add(entity.mesh)
                    entity.mesh.position.fromArray([0, 0, 0])
                    entity.mesh.updateMatrix()

                }

            

        }

    }

    setHandOrientation ( component, position, rotation, index ) {

        let mesh = component.mesh

        if ( mesh ) {
    
            mesh.autoUpdateMatrix = false
            mesh.position.fromArray(position).multiplyScalar(1).add(this.world.camera.position)
            mesh.translateX(0.03+ index*-0.05)
            mesh.position.y += this.world.floorHeight
            mesh.quaternion.fromArray(rotation)
            
        }
        
    }

    toggleTrackedHands ( component, toggle = true ) {
      
      let scene = window.three.scene,
          avatar = component.entity,
          position = avatar.mesh.position,
          cursors = avatar.componentsByProp.cursor,
          hands = avatar.componentsByProp.hand

      if ( cursors ) {

       cursors[0].mesh.visible = !toggle

      } 

      hands.map( ( handComponent, i ) => {

        let hand = handComponent.mesh

        if ( toggle ) { 
            //this.headMountedCursor.mesh.visible = false // activate under certain conditions..
            hand.parent.remove(hand)
            scene.add(hand)
            hand.position.set(position.x -0.25+ i*0.050, position.y -0.050, position.z -0.25)
            
            if ( i > 0 ) {

              if ( !!hand.children[0] ) {

                hand.children[0].visible = true

              }  

            } 

        } else {

            avatar.mesh.add(hand)

            if ( i > 0 ) {

              if ( !!hand.children[0] ) {

                hand.children[0].visible = false

              }  

            }

            hand.position.set(-0.35+ i*0.7, -0.25, -0.25)

        }

        hand.updateMatrix()

      })

    }

}

