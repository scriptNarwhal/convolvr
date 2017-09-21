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
            }
        }
    }

    // ~probably define grabbing / gesture animations here~ nope, that'll live in it's own module

    toggleTrackedHands ( component, toggle = true ) { console.log('toggle hands', toggle)
      
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

