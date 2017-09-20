let isVRMode = (mode) => {
	return (mode == "3d" || mode == "stereo");
}

export default class Touch { // based on example here https://developer.mozilla.org/en/docs/Web/API/Touch_events

	constructor ( input ) {
    
		this.ongoingTouches = []
		this.firstTouch = [ [0,0], [0,0] ]
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

			nTouches = touches.length

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
					if ( idx < 2 ) {
						input.moveVector.x -= (newTouch.pageX - input.lastTouch[idx][0]) * 0.2
						input.moveVector.z -= (newTouch.pageY - input.lastTouch[idx][1]) * 0.2
						input.lastTouch[ idx ] = [ newTouch.pageX, newTouch.pageY ]
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

		for (let i = 0; i < touches.length; i++) {

			let idx = this.ongoingTouchIndexById( touches[ i ].identifier )

			if ( idx > -1 && idx < 2 ) {

				if ( Math.abs(first[ idx ][0] - ongoingTouches[idx].pageX) < 28 && Math.abs(first[ idx ][1] - ongoingTouches[idx].pageY) < 28 ) {

					tools.usePrimary(0, 0)

				}

			} 

			ongoingTouches.splice(idx, 1)

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
