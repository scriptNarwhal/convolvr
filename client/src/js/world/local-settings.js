export default class Settings {

	constructor(world) {

		this.world = world

		let settings = this,
			options = ["camera", 'vrMovement', 'IOTMode', 'lighting', 'geometry','postProcessing', 'aa', 'shadows', 'floorHeight', 'viewDistance', 'leapMode', 'manualLensDistance', 'fov', 'blurEffect']

		options.map( item => {
				settings[ item ] = localStorage.getItem( item )
			})

		if (this.cameraMode == null) {

			this.cameraMode = 'fps'
			localStorage.setItem("camera", 'fps')

		}

		if (this.leapMode == null) {

			this.leapMode = "hybrid"
			localStorage.setItem("leapMode", this.leapMode)

		}

		if (this.vrMovement == null) {

			this.vrMovement = 'stick' // change to teleport later
			localStorage.setItem("vrMovement", this.vrMovement)

		}

		if (this.IOTMode == null) {

			this.IOTMode = 'off'
			localStorage.setItem("IOTMode", this.IOTMode)

		}

		if (this.blurEffect == null) {
			this.blurEffect = !this.world.mobile
			localStorage.setItem("blurEffect", this.blurEffect ? "on" : "off")
		} else {
			this.blurEffect = this.blurEffect == "on"
		}

		if (this.aa == null) {

			this.aa = 'on'
			localStorage.setItem("aa", this.aa)

		}

		if (this.shadows == null) {

			this.shadows = 0
			localStorage.setItem("shadows", this.shadows)

		} else {

			this.shadows = parseInt(this.shadows)

		}

		if (this.geometry == null) {

			this.geometry = window.innerWidth < 720 ? 1 : 2

		} else {

			this.geometry = parseInt(this.geometry)

		}

		if (this.lighting == null) {

			this.lighting = 'high'
			localStorage.setItem("lighting", !world.mobile ? 'high' : 'low')

		} 

		if (this.enablePostProcessing == null) {

			this.enablePostProcessing = 'off'
			localStorage.setItem("postProcessing", this.enablePostProcessing)

		}

		if (this.floorHeight == null) {

			this.floorHeight = 0
			localStorage.setItem("floorHeight", this.floorHeight)

		} else {

			this.floorHeight = parseFloat( this.floorHeight )

		}

		if (this.viewDistance == null) {

			this.viewDistance = 0
			localStorage.setItem("viewDistance", 0)

		} else {

			this.viewDistance = parseInt(this.viewDistance)

		}

		if (this.fov == null) {

			this.fov = 75
			localStorage.setItem("fov", this.fov)

		} else {

			this.fov = parseInt(this.fov)

		}

		if (this.manualLensDistance == null) {

			this.manualLensDistance = 0

		} else {

			this.manualLensDistance = parseFloat(this.manualLensDistance)

		}
		
		this.IOTMode = this.IOTMode == 'on'
		world.userInput.leapMode = this.leapMode

	}

}