let isVRMode = (mode) => {
	return (mode == "vr" || mode == "stereo");
}

export default class Touch {
  constructor (input) {
    document.body.addEventListener("touchmove", function(event) {
			var data = event.touches, touch = data.length;
			if (isVRMode("vr")) {
				event.preventDefault();
				if (touch < 2) {
					input.rotationVector.y += (data[0].pageX - input.lastTouch[0][0]) / 500.0;
					input.rotationVector.x += (data[0].pageY - input.lastTouch[0][1]) / 500.0;
					input.lastTouch = [ [data[0].pageX, data[0].pageY], [data[0].pageX, data[0].pageY]];
				} else {
					while (touch-- > 0) {
						input.moveVector.x -= (data[touch].pageX - input.lastTouch[touch][0])*180;
						input.moveVector.z -= (data[touch].pageY - input.lastTouch[touch][1])*180;
						input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
					}
				}
			}
		});
		document.body.addEventListener("touchstart", function(event) {
			var data = event.touches, touch = data.length ;
			//input.lastTouch = [[0,0],[0,0]];
			if (isVRMode(world.mode)) {
				//event.preventDefault();
				while (touch-- > 0) {
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
				}
			}
		});
  }
}
