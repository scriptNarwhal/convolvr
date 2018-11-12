

export type SpaceConfig = {
	id:                  number,     
	userID:              number,     
	userName:            string  
	name:                string  
	protected:           boolean,    
	gravity:             number 
	highAltitudeGravity: boolean,  
	partitionType:       Partition,    
	sky:                 Sky,
	light:               SpaceLight, 
	terrain:             SpaceTerrain,
	spawn:               Spawn,
	tags:                string[],
	description:         string,
	voxels:              any[]
}

export type Partition = {
	type:           string,
	splitThreshold: number, 
}

export type Sky = {
	skyType:     string   
	red:         number  
	green:       number  
	blue:        number  
	layers:      Layer[] 
	skybox:      string[] 
	photosphere: string   
}

export type Layer = {
	movement:      number[],
	opacity:       number,
	altitude:      number,
	texture:       string,
	customTexture: string 
}

export type SpaceLight = {
	color:        number,     
	intensity:    number, 
	pitch:        number,  // radians; 0 == top down
	yaw:       number, 
	ambientColor: number, 
}

export type SpaceTerrain = {
	type: string, 
	turbulent:   boolean, 
	flatAreas:   boolean, 
	height:      number,     
	color:       number,     
	red:        number, 
	green:       number, 
	blue:      number, 
	flatness:    number, 
	decorations: string  
}

export type Spawn = {
	Entities?:   boolean, 
	Structures?: boolean, 
	Roads?:      boolean, 
	Walls?:      boolean, 
	Trees?:      boolean, 
	npcs?:       boolean, 
	tools?:      boolean, 
	vehicles?:   boolean, 
	computers?:  boolean, 
	tubes?:      boolean, 
	pylons?:     boolean, 
	rocks?:      boolean, 
	orbs?:       boolean, 
	columns?:    boolean, 
	pyramids?:   boolean,
}
