let isVRMode = (mode) => {
	return (mode == "3d" || mode == "stereo");
}

export default class Touch { // based on example here https://developer.mozilla.org/en/docs/Web/API/Touch_events

  constructor (input) {
    
	this.ongoingTouches = []

	let world = input.world,
		tools = world.user.toolbox,
		ongoingTouches = this.ongoingTouches

	function _handleCancel( evt ) {

		evt.preventDefault()

		let touches = evt.changedTouches
			
		for (let i = 0; i < touches.length; i++) {
			let idx = ongoingTouchIndexById(touches[i].identifier)
			ongoingTouches.splice( idx, 1 )  // remove it; we're done
		}

	}

	function _ongoingTouchById( idToFind ) {

		let ongoingTouches = this.ongoingTouches

		for (let i = 0; i < ongoingTouches.length; i++) {
			let id = ongoingTouches[i].identifier
			
			if (id == idToFind) {
				return i
			}
		}

		return -1    // not found

	}

	function _copyTouch( touch ) {

		return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY }

	}

	three.renderer.domElement.addEventListener("touchmove", event =>  {
			
			let  data = event.touches,
				 touch = data.length

			if ( input.world.mode != "web" ) { 

				event.preventDefault()

				while (touch-- > 0) {
					input.moveVector.x -= (data[touch].pageX - input.lastTouch[touch][0])*2800;
					input.moveVector.z -= (data[touch].pageY - input.lastTouch[touch][1])*2800;
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
				}

			}

		}, false)

		three.renderer.domElement.addEventListener("touchstart", event => {
			
			var touches = evt.changedTouches;

			while ( touch >= 0 ) {
			
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY]
					touch -= 1
			
			}

		}, false)

		three.renderer.domElement.addEventListener("touchend", event => {
			
			let last = input.lastTouch,
				touches = evt.changedTouches;

			input.world.mode != "web" && event.preventDefault()

			for (let i = 0; i < touches.length; i++) {

				let idx = _ongoingTouchIndexById(touches[i].identifier);

				if (idx > -1 && idx <= 2) {
					last[touch] = [ongoingTouches[idx].pageX, ongoingTouches[idx].pageY]
				} 
				ongoingTouches.splice(idx, 1)
			}

		}, false)

  }

  

  
}
