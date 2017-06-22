export default function initLocalSettings ( world ) {

		let cameraMode = localStorage.getItem("camera"),
			vrMovement = localStorage.getItem("vrMovement"),
			IOTMode = localStorage.getItem("IOTMode"),
			lighting = localStorage.getItem("lighting"),
			enablePostProcessing = localStorage.getItem("postProcessing"),
			aa = localStorage.getItem("aa"),
			floorHeight = localStorage.getItem("floorHeight"),
			viewDistance = localStorage.getItem("viewDistance"),
			leapMode = localStorage.getItem("leapMode"),
			manualLensDistance = localStorage.getItem("manualLensDistance")

		if ( cameraMode == null ) {

			cameraMode = 'fps'
			localStorage.setItem("camera", 'fps')

		}

		if ( leapMode == null ) {

			leapMode = "hybrid"
			localStorage.setItem( "leapMode", leapMode )

		}

		if ( vrMovement == null ) {

			vrMovement = 'stick' // change to teleport later
			localStorage.setItem("vrMovement", vrMovement)

		}

		if ( IOTMode == null ) {

			IOTMode = 'off'
			localStorage.setItem("IOTMode", IOTMode)

		}

		if ( aa == null ) {

			aa = 'on'
			localStorage.setItem("aa", aa)

		}

		if ( lighting == null ) {

			lighting = 'high'
			localStorage.setItem("lighting", !world.mobile ? 'high' : 'low')

		}

		if ( enablePostProcessing == null ) {

			enablePostProcessing = 'off'
			localStorage.setItem("postProcessing", enablePostProcessing)

		}

		if ( floorHeight == null ) {

			floorHeight = 0
			localStorage.setItem("floorHeight", floorHeight)

		} 

		if ( viewDistance == null ) {

			viewDistance = 0
			localStorage.setItem("viewDistance", 0)

		} else {

			viewDistance = parseInt(viewDistance)

		}

		if ( manualLensDistance == null ) {

			manualLensDistance = 0

		} else {

			manualLensDistance = parseFloat(manualLensDistance)

		}

		world.aa = aa
		world.viewDistance = viewDistance
		world.cameraMode = cameraMode
		world.vrMovement = vrMovement
		world.lighting = lighting
		world.enablePostProcessing = enablePostProcessing
		world.IOTMode = IOTMode == 'on'
		world.floorHeight = parseInt(floorHeight)
		world.userInput.leapMode = leapMode
		world.manualLensDistance = manualLensDistance

	}