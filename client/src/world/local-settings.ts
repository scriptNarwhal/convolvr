import Convolvr from '../world/world'

const str = "string",
	  int = "integer",
	  float = "float",
	  bool = "boolean";

enum SettingType {
	str,
	int,
	float,
	bool
} 
export default class Settings {

	public cameraMode: any
	public vrMovement: string
	public IOTMode: boolean
	public lighting: number
	public geometry: number
	public postProcessing: any
	public aa: any
	public shadows: any
	public floorHeight: any
	public viewDistance: any
	public leapMode: any
	public manualLensDistance: any
	public fov: any
	public blurEffect: any
	public dpr: any
	public gravity: number
	public world: Convolvr

	constructor(world: Convolvr) {
		this.world = world

		let options: string[]   =  ["cameraMode", 	  'vrMovement',         'IOTMode',         'lighting',       'geometry',
					  			    'postProcessing', 'aa', 		        'shadows',         'floorHeight',    'viewDistance', 
					  			    'leapMode',       'manualLensDistance', 'fov',             'blurEffect',     'dpr'],
			types: SettingType[] = [ SettingType.str,  SettingType.str,      SettingType.bool, SettingType.int,   SettingType.int,
									 SettingType.bool, SettingType.bool, 	 SettingType.int,  SettingType.float, SettingType.int,            
									 SettingType.str,  SettingType.float,    SettingType.int,  SettingType.bool,  SettingType.float],
			defaults = 			   ["fps",             "stick",              "off",            2,                 window.innerWidth < 720 ? 1 : 2, 
									"off",   		   "off",  				 0, 			   0, 				  0, 
									"hybrid",  		   0, 					 75, 			   "off", 			  0],
			settings = this

		options.map( (setting, i) => {
				let settingValue: any = localStorage.getItem( setting )
				if (settingValue === null) {
					settingValue = defaults[ i ];
					localStorage.setItem( setting, settingValue )
				}
				settings.setValue( settingValue, setting, types[ i ] )
			})

		world.userInput.leapMode = this.leapMode
		this.gravity = 1
	}

	setValueWithType(value: any, type: SettingType ): any {
		switch (type) {
			case SettingType.bool:
				return value == "on" ? true : false;
			case SettingType.int:
				return parseInt( value );
			case SettingType.float:
				return parseFloat( value );
			case SettingType.str:
				return value;
		}
	}

	setValue( value: any, key: string, type: SettingType): void {
		switch (key) {
			case "cameraMode":
			this.cameraMode = this.setValueWithType(value, type)
			break
			case 'vrMovement':
			this.vrMovement = this.setValueWithType(value, type)
			break
			case 'IOTMode':
			this.IOTMode = this.setValueWithType(value, type)
			break 
			case 'lighting':
			this.lighting = this.setValueWithType(value, type)
			break
			case 'geometry':
			this.geometry = this.setValueWithType(value, type)
			break
			case 'postProcessing':
			this.postProcessing = this.setValueWithType(value, type)
			break
			case 'aa':
			this.aa = this.setValueWithType(value, type)
			break
			case 'shadows':
			this.shadows = this.setValueWithType(value, type)
			break
			case 'floorHeight':
			this.floorHeight = this.setValueWithType(value, type)
			break
			case 'viewDistance':
			this.viewDistance = this.setValueWithType(value, type)
			break
			case 'leapMode':
			this.leapMode = this.setValueWithType(value, type)
			break
			case 'manualLensDistance':
			this.manualLensDistance = this.setValueWithType(value, type)
			break
			case 'fov':
			this.fov = this.setValueWithType(value, type)
			break
			case 'blurEffect':
			this.blurEffect = this.setValueWithType(value, type)
			break
			case 'dpr':
			this.dpr = this.setValueWithType(value, type)
			break
		}
	}
}