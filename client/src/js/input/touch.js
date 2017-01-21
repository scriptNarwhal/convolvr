let isVRMode = (mode) => {
	return (mode == "vr" || mode == "stereo");
}

export default class Touch {
  constructor (input) {
    document.body.addEventListener("touchmove", function(event) {
			var data = event.touches,
					touch = data.length;
			if (isVRMode("vr")) {
				event.preventDefault();
				if (touch < 2) {
					input.rotationVector.y += (data[0].pageX - input.lastTouch[0][0]) / 200.0;
					input.rotationVector.x += (data[0].pageY - input.lastTouch[0][1]) / 200.0;
					input.lastTouch = [ [data[0].pageX, data[0].pageY], [data[0].pageX, data[0].pageY]];
				} else {
					while (touch-- > 0) {
						input.moveVector.x -= (data[touch].pageX - input.lastTouch[touch][0])*8800;
						input.moveVector.z -= (data[touch].pageY - input.lastTouch[touch][1])*8800;
						input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
					}
				}
			}
		});
		document.body.addEventListener("touchstart", function(event) {
			var data = event.touches,
					touch = data.length
			while (touch-- >= 0) {
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
			}
		});
		document.body.addEventListener("touchend", function(event) {
			var data = event.touches,
					touch = data.length,
					last = input.lastTouch;
			// if (touch == 1) {
			// 	if (Math.abs(data[0].pageX - last[0][0]) < 48 && Math.abs(data[0].pageY - last[0][1]) < 48 ) {
			//
			// 	}
			// }
			while (touch-- > 0) {
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
			}
		});
  }
}
