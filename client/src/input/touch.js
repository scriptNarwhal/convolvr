let isVRMode = (mode) => {
	return (mode == "3d" || mode == "stereo");
}

export default class Touch { // based on example here https://developer.mozilla.org/en/docs/Web/API/Touch_events

	constructor ( input ) {
    
		this.ongoingTouches = []
		this.firstTouch = [ [0,0], [0,0], [0,0], [0, 0], [0, 0] ]
		this.lastTouch = [ [0,0], [0,0], [0,0], [0, 0], [0, 0] ]
		this.grabbing = false
		this.input = input
		this.world = input.world

		let world = input.world,
			tools = world.user.toolbox,
			system = this,
			domElement = three.renderer.domElement

		domElement.addEventListener("touch", event => this.onTouch( event ), false)
		domElement.addEventListener("touchmove", event => this.onTouchMove( event ), false)
		domElement.addEventListener("touchstart", event => this.onTouchStart( event ), false)
		domElement.addEventListener("touchend", event => this.onTouchEnd( event ), false)
		domElement.addEventListener("touchcancel", event => this.onTouchCancel( event ), false)

  	}

	onTouch ( event ) {

		let input = this.input,
			world = input.world,
			tools = world.user.toolbox

  	}

	onTouchStart ( event ) {

		let tools = this.input.world.user.toolbox

		this.world.mode != "web" && event.preventDefault()

		let touches = event.changedTouches,
			ongoingTouches = this.ongoingTouches,
			input = this.input,
			nTouches = touches.length

		for ( let i = 0; i < nTouches; i++ ) {

			let newTouch = this.copyTouch( touches[ i ] )
			ongoingTouches.push( newTouch )

			if ( i < 2 ) {
				this.firstTouch[i] = [ newTouch.pageX, newTouch.pageY ]
				input.lastTouch[i] = [ newTouch.pageX, newTouch.pageY ]
			}

			if ( ongoingTouches.length === 3 ) {

				tools.grip( 0, 1 )
				this.grabbing = true

			}

		}

  	}

	onTouchMove ( event ) {

		event.preventDefault()

		let touches = event.changedTouches,
			ongoingTouches = this.ongoingTouches,
			input = this.input,
			nTouches = touches.length,
			newTouch = null
	
		if ( input.world.mode != "web" ) { 

			for (let i = 0; i < nTouches; i++) {
				
				let idx = this.ongoingTouchIndexById( touches[ i ].identifier )
				if ( idx >= 0 ) {
					newTouch = this.copyTouch( touches[ i ] )
					ongoingTouches.splice(idx, 1, newTouch)  // swap in the new touch record
					if ( idx < 3 ) {

						if ( ongoingTouches.length >= 3 ) {

							input.moveVector.x -= (newTouch.pageX - input.lastTouch[i][0]) * 0.05
							input.moveVector.z -= (newTouch.pageY - input.lastTouch[i][1]) * 0.05

						} else {

							input.moveVector.x -= (newTouch.pageX - input.lastTouch[i][0]) * 0.2
							input.moveVector.z -= (newTouch.pageY - input.lastTouch[i][1]) * 0.2

						}
						
						input.lastTouch[ i ] = [ newTouch.pageX, newTouch.pageY ]
					}
				} 
			}

		}

  	}

	onTouchEnd ( event ) {

		let input = this.input,
			world = input.world,
			tools = world.user.toolbox

		input.world.mode != "web" && event.preventDefault()
		
		let touches = event.changedTouches,
			ongoingTouches = this.ongoingTouches,
			first = this.firstTouch,
			last = input.lastTouch

		if ( this.grabbing ) {

			this.grabbing = false		
			tools.grip( 0, -1 )

		}

		for (let i = 0; i < touches.length; i++) {

			let idx = this.ongoingTouchIndexById( touches[ i ].identifier )

			if ( idx > -1 && idx < 2 ) {
					
				if ( Math.abs(first[ idx ][0] - ongoingTouches[idx].pageX) < 20 && Math.abs(first[ idx ][1] - ongoingTouches[idx].pageY) < 20 )
					
					tools.usePrimary(0, 0)
					
					
			} 

			ongoingTouches.splice(i, 1)
			

		}
  	}

	onTouchCancel ( event ) {

		event.preventDefault()

		let touches = event.changedTouches,
			ongoingTouches = this.ongoingTouches
			
		for (let i = 0; i < touches.length; i++) {
			let idx = this.ongoingTouchIndexById(touches[i].identifier)
			ongoingTouches.splice( idx, 1 )  // remove it; we're done
		}

  	}

	ongoingTouchIndexById( idToFind ) {

		let ongoingTouches = this.ongoingTouches

		for (let i = 0; i < ongoingTouches.length; i++) {
			let id = ongoingTouches[i].identifier
			
			if (id == idToFind) {
				return i
			}
		}

		return -1    // not found

	}

	copyTouch( touch ) {

		return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY }

	}

}
