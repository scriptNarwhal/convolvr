let isVRMode = (mode) => {
	return (mode == "3d" || mode == "stereo");
}

export default class Touch {

  constructor (input) {
    
	document.body.addEventListener("touchmove", (event) =>  {
			
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

		})

		document.body.addEventListener("touchstart", (event) => {
			
			let data = event.touches,
				touch = data.length

			if ( input.world.mode != "web" ) { 

				event.preventDefault()

			}

			while (touch-- >= 0) {
			
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
			
			}

		})

		document.body.addEventListener("touchend", (event) => {
			
			let data = event.touches,
					touch = data.length,
					last = input.lastTouch

			if ( input.world.mode != "web" ) { 

				event.preventDefault()

			}

			while ( touch-- > 0 ) {

					if (!! data[touch]) {

						input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY]

					}
					
			}

		})

  }
  
}
