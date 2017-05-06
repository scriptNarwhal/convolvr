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
				while (touch-- > 0) {
					input.moveVector.x -= (data[touch].pageX - input.lastTouch[touch][0])*8800;
					input.moveVector.z -= (data[touch].pageY - input.lastTouch[touch][1])*8800;
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
				}
			}
		})
		document.body.addEventListener("touchstart", function(event) {
			var data = event.touches,
					touch = data.length
			while (touch-- >= 0) {
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
			}
		})
		document.body.addEventListener("touchend", function(event) {
			var data = event.touches,
					touch = data.length,
					last = input.lastTouch

			while (touch-- > 0) {
					input.lastTouch[touch] = [data[touch].pageX, data[touch].pageY];
			}
		})
  }
}
