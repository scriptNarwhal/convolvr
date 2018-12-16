/*  static collision detection worker */

let distance2d = ( a: number[], b: number[] ): number => {
    return Math.sqrt( Math.pow( (a[0]-b[0]), 2 ) + Math.pow( (a[2]-b[2]), 2 ) )
  },
  distance2dCompare = ( a: number[], b: number[], n: number): boolean => { // more efficient version of distance2d()
	  return Math.pow( (a[0]-b[0]), 2 ) + Math.pow( (a[2]-b[2]), 2 ) < (n*n)
  },
  distance3dCompare = ( a: number[], b: number[], n: number): boolean => { // ..faster than using Math.sqrt()
	  return (Math.pow( (a[0]-b[0]), 2 ) + Math.pow( (a[1]-b[1]), 2 ) + Math.pow( (a[2]-b[2]), 2 ) ) < (n*n)
  }

let observer = {
		position: [0, 0, 0],
		prevPos: [0, 0, 0],
		velocity: [0, 0, 0],
		vrHeight: 1.66
	},
	voxelList: any[] = [],
	voxels: any = []

let scWorker = (self as any);

scWorker.update = ( ) => {

	var distance = 0,
		position: any = observer.position,
		innerBox 	 = [false, false],
		velocity 	 = observer.velocity,
		vrHeight 	 = observer.vrHeight,
		collision 	 = false,
		yPos 		 = 0,
		voxel 		 = null,
		ent 		 = null,
		entRadius    = 10,
		structure 	 = null,
		bounds 		 = [0, 0],
		voxel 		 = null,
		delta 		 = [0, 0],
		oPos 		 = [],
		speed 		 = 0,
		e 			 = 0,
		i 			 = 0,
		v 			 = 0

	for ( i = 0; i < voxelList.length; i ++ ) {
		voxel = voxelList[ i ]

		if ( !!!voxel || !!!voxel.position) continue
		if ( !!voxel && distance2dCompare( position, voxel.position, 180 ) ) { 	// do collisions on voxels & structures... just walls at first..
			if ( voxel.loaded == undefined ) {
				voxel.loaded = true
				scWorker.postMessage('{"command": "load entities", "data":{"coords":"'+voxel.cell[0]+'.'+voxel.cell[1]+'.'+voxel.cell[2]+'"}}');
			}
			if ( distance2dCompare( position, voxel.position, 60 ) ) {

				let alt = voxel.altitude || 0

				yPos = voxel.position[1]
				if ( distance2dCompare( position, voxel.position, 24.5 ) ) {
					if ( position[1] > yPos - 22 + vrHeight  && position[1] < 13.25+yPos + (vrHeight != 0 ? vrHeight+0.25 : 0) ) {
						collision = true
						scWorker.postMessage('{"command": "platform collision", "data":{"type":"top", "position":[' + voxel.position[0] + ',' + yPos + ',' + voxel.position[2] + '] }}');
					}
				}
				if ( !!voxel.entities && voxel.entities.length > 0 ) {
					collision = scWorker.checkStaticCollisions( voxel, position )
				}
			}
		}
	}

	if ( !collision )
		observer.prevPos = [ observer.position[0], observer.position[1], observer.position[2] ]

	scWorker.postMessage('{"command": "update"}')
	scWorker.updateLoop = setTimeout( () => {
		scWorker.update()
	}, 15)
}

scWorker.checkStaticCollisions = ( voxel: any, position: number[] ) => {
	let e = voxel.entities.length - 1,
		ent: any = null,
		entRadius = 10,
		collision = false

	while (e >= 0) {
		ent = voxel.entities[e]
		entRadius = ent.boundingRadius
		if (!!!ent || !!!ent.components) {
			console.warn("Problem with entity! ", e, ent); continue
		}
		if (distance3dCompare(
			position,
			[ent.position[0] - entRadius/2.0, ent.position[1],
			ent.position[2] - entRadius/2.0], (entRadius * 1.6 || 3) + 2.5
		)) {

			for (const entComp of ent.components) {
				let boundingRadius = entComp.boundingRadius * 1.2 ||
					entComp.attrs.geometry && entComp.attrs.geometry.size 
					? Math.max(entComp.attrs.geometry.size[0], entComp.attrs.geometry.size[2]) * 1.2
					: 2;

				if (!!entComp.attrs.floor) {
					const rootPos = ent.position.map( (v: any) => v-ent.boundingRadius / 2.0 ),
						size = entComp.attrs.geometry.size,
						rotation = entComp.quaternion[3],
						relativePosition = [rootPos[0] + entComp.position[0]-(rotation == 1 ? size[0]/2.0 : 0), 0, rootPos[2] + entComp.position[2]];
					if (distance2dCompare(
						position,
						relativePosition,
						boundingRadius * 1.2
					)) {
						// if (boxCollision(relativePosition[0], relativePosition[2], size[0], size[2], position[0], position[2])) {
							const verticalOffset = (position[1] + 2 - (entComp.position[1] + ent.position[1] )); //  + entComp.geometry ? entComp.geometry.size[1] : 1
						if (verticalOffset > 0 && verticalOffset < 4) {
							scWorker.postMessage(JSON.stringify({
								command: "floor collision", data: {
									position: entComp.position,
									floorData: entComp.attrs.floor
								}
							}))
							collision = true
						}
						// }
					}
				} else if (distance3dCompare(
					position,
					[ent.position[0] + entComp.position[0], ent.position[1] + entComp.position[1], ent.position[2] + entComp.position[2]],
					boundingRadius
				)) {
					collision = true
					scWorker.postMessage(JSON.stringify({ command: "entity-user collision", data: { position: entComp.position } }))
				}

			}
		}
		e -= 1
	}
	return collision
}

function boxCollision(x: number, z: number, w: number, l: number, cx: number, cz: number) {
	const box = [x+w, z+l];

	if (cx < x || cx > box[0] || cz < z || cz > box[1]) {
		return false;
	} 
	return true;
}

scWorker.onmessage = (event: any) => {
	let message = JSON.parse( event.data ),
		data 	= message.data,
		user 	= observer;

	switch ( message.command ) {
		case "update":
			// user.prevPos = [user.position[0], user.position[1], user.position[2]];
			user.position = data.position
			user.velocity = data.velocity
			user.vrHeight = data.vrHeight
			//scWorker.postMessage(JSON.stringify(scWorker.observer));
		break;
		case "add voxels":
			scWorker.addVoxels( message, data );
		break;
		case "remove voxels":
			scWorker.removeVoxels( message, data )
		break;
		case "add entity":
			scWorker.addEntity();
		break;
		case "remove entity":
			scWorker.removeEntity( message, data );
		break;
		case "update entity":
				scWorker.updateEntity( message, data )
		break;
		case "update telemetry":
				scWorker.updateTelemetry( message, data )
		break;
		case "clear":
			voxels = [];
			voxelList = [];
		break;
		case "start":
			scWorker.update();
		break;
		case "stop":
			scWorker.stop();
		break;
		case "log":
			if (data == "") {
				scWorker.postMessage('{"command":"log","data":[' + user.position[0] + ',' + user.position[1] + ',' + user.position[2] + ']}');
				scWorker.postMessage('{"command":"log","data":' + JSON.stringify(voxels)+ '}');
			}
		break;
	}
};

scWorker.addVoxels = (message: any, data: any) => {
	voxelList = voxelList.concat(data)
	for (let v in data) {
		voxels[ data[v].cell.join(".") ] = data[v];
	}
}

scWorker.removeVoxels = (message: any, data: any) => {
	let toRemove = null,
		voxel = null,
		c 		 = 0,
		p 		 = data.length -1

	while ( p >= 0 ) {
		toRemove = data[p]
		c = voxelList.length-1

		while ( c >= 0 ) {
			voxel = voxelList[ c ]
			if ( voxel != null && voxel.cell[0] == toRemove.cell[0] && voxel.cell[1] == toRemove.cell[1]
																	&& voxel.cell[2] == toRemove.cell[2] ) {
				voxelList.splice( c, 1 )
				voxels[ voxel.cell.join(".")] = null
			}
			c--
		}
		p --
	}
}

scWorker.addEntity = (message: any, data: any) => {
	if (!data) {
		console.warn("no data for addEntity")
		return
	}
	if (!!! voxels[data.coords.join(".")]) {
		voxels[data.coords.join(".")] = { entities: [], cell: data.coords }
	}
	let entities = voxels[data.coords.join(".")].entities;

	entities.push( data.entity )
}

scWorker.removeEntity = ( message: any, data: any ) => {
	let entities = voxels[ data.coords.join(".") ].entities;

	if ( entities != null ) {
		let c = entities.length-1;

		while ( c >= 0 ) {
			if ( entities[c].id == data.entityId ) {
				voxels[ data.coords.join(".") ].entities.splice(c, 1)
				c = -1
			}
			c--
		}
	}
}

scWorker.updateEntity = (message: any, data: any) => {
	let cell =  data.coords.join(".");

	if (!data || !data.coords) {
		console.warn("no data to update entity")
		return
	}
	if ( !voxels[cell] ) {
		console.warn("can't update entity with no voxel")
		return
	}
	let entities = voxels[ cell ].entities

	if ( entities != null ) {
		let c = entities.length-1;

		while ( c >= 0 ) {
			if (entities[ c ].id == data.entityId) {
				entities[ c ] = data.entity
				c = -1
			}
			c--
		}
	}
}

scWorker.updateTelemetry = (message: any, data: any) => {
	if (!data || !data.coords) {
		console.warn("no data to update entity")
		return
	}
	let cell =  data.coords.join(".");

	if ( !voxels[cell] ) {
		console.warn("can't update entity with no voxel")
		return
	}
	let entities = voxels[ cell ].entities,
		oldCell = message.data.oldCoords.join("."),
		oldEntities = voxels[oldCell].entities;

	
	if (oldCell != cell) {
		let c = oldEntities.length - 1;

		while (c >= 0) {
			let movedEnt = oldEntities[c];
			console.info("checking moved entity", movedEnt);
			if (movedEnt.id == data.entityId) {
				console.log("found entity to move &&&&&& ", movedEnt);
				oldEntities.splice(oldEntities.indexOf(movedEnt), 1)
				entities.push(movedEnt)
				console.log("physics worker: update telemetry: moved between voxels")
				movedEnt.position = data.position
				if (data.quaternion) {
					movedEnt.quaternion = data.quaternion;
				}
				c = -1
			}
		}

	} else {
		if (entities != null) {
			let c = entities.length - 1;
			console.info("checking not moved very-far entity", entities[c])
			while (c >= 0) {
				if (entities[c].id == data.entityId) {
					console.info("physics worker: update telemetry")
					entities[c].position = data.position
					if (data.quaternion) {
						entities[c].quaternion = data.quaternion;
					}
					c = -1
				}
				c--
			}
		}
	}
}

scWorker.stop = () => {
	clearTimeout( scWorker.updateLoop )
}
