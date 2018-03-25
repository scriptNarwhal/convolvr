const str = "string",
	  int = "integer",
	  float = "float",
	  bool = "boolean";

export default class Settings {

	constructor(world) {
		this.world = world

		let options = ["cameraMode", 'vrMovement', 'IOTMode', 'lighting', 'geometry','postProcessing', 'aa', 'shadows', 'floorHeight', 'viewDistance', 'leapMode', 'manualLensDistance', 'fov', 'blurEffect', 'dpr'],
			types =   [ str,      str,          bool,      int,        int,       bool,             bool, int,       float,         int,            str,        float,                int,       bool,         float],
			defaults = ["fps",    "stick",      "off",     2,          window.innerWidth < 720 ? 1 : 2, "off", "off", 0, 0,         0,              "hybrid",   0,                    75,        "off",        0],
			settings = this

		options.map( (item, i) => {
				let setting = localStorage.getItem( item )
				if (setting === null) {
					setting = defaults[ i ];
					localStorage.setItem( item, setting )
				}
				settings.setValueWithType( item, setting, types[ i ] )
			})

		world.userInput.leapMode = this.leapMode
		this.gravity = 1
	}

	setValueWithType( key, value, type ) {

		switch (type) {
			case "boolean":
				this[ key ] = value == "on" ? true : false;
			break;
			case "integer":
				this[ key ] = parseInt( value );
			break;
			case "float":
				this[ key ] = parseFloat( value );
			break;
			case "string":
				this[ key ] = value;
			break;
		}
	}
}