import Convolvr from '../world/world'

enum SettingType {
	str,
	int,
	float,
	bool
} 
export default class Settings {

	public cameraMode: any
	public vrMovement: string
	public mirrorOutput = false
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
					  			    'leapMode',       'manualLensDistance', 'fov',             'blurEffect',     'dpr',              'mirrorOutput'],
			types: SettingType[] = [ SettingType.str,  SettingType.str,      SettingType.bool, SettingType.int,   SettingType.int,
									 SettingType.bool, SettingType.bool, 	 SettingType.int,  SettingType.float, SettingType.int,            
									 SettingType.str,  SettingType.float,    SettingType.int,  SettingType.bool,  SettingType.float, SettingType.bool],
			defaults = 			   ["fps",             "stick",              "false",            2,                 window.innerWidth < 720 ? 1 : 2, 
									"false",   		   "false",  				 0, 			   0, 				  0, 
									"hybrid",  		   0, 					 75, 			   "false", 			  0,             'false'],
			settings = this

		options.map( (setting, i) => {
				let settingValue: any = localStorage.getItem( setting )
				if (settingValue === null) {
					settingValue = defaults[ i ];
					localStorage.setItem( setting, settingValue )
				}

				settings.setValue( settingValue, setting, types[ i ] )
			});

		world.userInput.leapMode = this.leapMode;
		this.gravity = 1;
	}

	setValueWithType(value: any, type: SettingType ): any {
		switch (type) {
			case SettingType.bool:
				return value === true || value == "true" ? true : false;
			case SettingType.int:
				return parseInt( value );
			case SettingType.float:
				return parseFloat( value );
			case SettingType.str:
				return value;
		}
	}

	setValue = ( value: any, key: string, type: SettingType) => {
		const settings = <any>this;
		settings[key as string] = this.setValueWithType(value, type) ;
	}
}