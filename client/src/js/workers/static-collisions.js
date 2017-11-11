/*  static collision detection worker */

let distance2d = ( a, b ) => {

    return Math.sqrt( Math.pow( (a[0]-b[0]), 2 ) + Math.pow( (a[2]-b[2]), 2 ) )

  },
  distance2dCompare = ( a, b, n ) => { // more efficient version of distance2d()

	  return Math.pow( (a[0]-b[0]), 2 ) + Math.pow( (a[2]-b[2]), 2 ) < (n*n)

  },
  distance3dCompare = ( a, b, n ) => { // ..faster than using Math.sqrt()

	  return (Math.pow( (a[0]-b[0]), 2 ) + Math.pow( (a[1]-b[1]), 2 ) + Math.pow( (a[2]-b[2]), 2 ) ) < (n*n)

  }

let observer = {
		position: [0, 0, 0],
		prevPos: [0, 0, 0],
		velocity: [0, 0, 0],
		vrHeight: 0
	},
	voxelList = [],
	voxels = []

self.update = ( ) => {

	var distance = 0,
		position 	 = observer.position,
		innerBox 	 = [false, false],
		velocity 	 = observer.velocity,
		vrHeight 	 = observer.vrHeight,
		closeToVenue =  false,
		collision 	 = false,
		cKey 		 = "",
		yPos 		 = 0,
		size 		 = 50000,
		voxel 		 = null,
		ent 		 = null,
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
				self.postMessage('{"command": "load entities", "data":{"coords":"'+voxel.cell[0]+'.'+voxel.cell[1]+'.'+voxel.cell[2]+'"}}');
						
			}

			if ( distance2dCompare( position, voxel.position, 60 ) ) {
					
				let alt = voxel.altitude || 0
				
				yPos = voxel.position[1]
				
				if ( distance2dCompare( position, voxel.position, 24.5 ) ) {
						
					if ( position[1] > yPos - 50 + vrHeight  && position[1] < yPos + 14.25 + (vrHeight != 0 ? vrHeight-1 : 0) ) {

						collision = true
						self.postMessage('{"command": "platform collision", "data":{"type":"top", "position":[' + voxel.position[0] + ',' + yPos + ',' + voxel.position[2] + '] }}');
					
					}

					if ( !!voxel.entities && voxel.entities.length > 0 ) {

						e = voxel.entities.length - 1

						while ( e >= 0 ) {

							ent = voxel.entities[ e ]

							if ( !!! ent || !!!ent.components ) { console.warn("Problem with entity! ",e ,ent); continue }

							if ( distance3dCompare( position, ent.position, (ent.boundingRadius||5)+0.5,) ) { 

								ent.components.map( entComp => {

									if ( distance3dCompare( position, entComp.position, entComp.boundingRadius || 3) ) {

										collision = true

										if ( !! entComp.props.floor ) { 

											self.postMessage( JSON.stringify( {command: "floor collision", data: { 
												position: entComp.position, 
												floorData: entComp.props.floor
											}}))

										} else {

											self.postMessage( JSON.stringify( {command: "entity-user collision", data:{ position: entComp.position }} ) )

										}

									}

								})

							}

							e -= 1

						}

					}
							
				}
							
			}

		}

	}

	if ( !collision )

		observer.prevPos = [ observer.position[0], observer.position[1], observer.position[2] ]
	

	self.postMessage('{"command": "update"}')
	self.updateLoop = setTimeout( () => {
		self.update()
	}, 15)

}

self.onmessage = function ( event ) { 

	var message  = JSON.parse( event.data ),
		data 	 = message.data,
		user 	 = observer,
		voxel 	 = null,
		toRemove = null,
		items 	 = [],
		entities = [],
		c 		 = 0,
		p 		 = 0
		
	if ( message.command == "update" ) {
		// user.prevPos = [user.position[0], user.position[1], user.position[2]];
		user.position = data.position
		user.velocity = data.velocity
		user.vrHeight = data.vrHeight
		//self.postMessage(JSON.stringify(self.observer));
	} else if ( message.command == "add voxels" ) {

		voxelList = voxelList.concat(data)

		data.map( v => {
			voxels[ v.cell.join(".") ] = v
		})

	} else if ( message.command == "remove voxels" ) {

		p = data.length -1

		while ( p >= 0 ) {

			toRemove = data[p]
			c = voxelList.length-1

			while ( c >= 0 ) {

				voxel = voxelList[ c ]

				if ( voxel != null && voxel.cell[0] == toRemove.cell[0] && voxel.cell[1] == toRemove.cell[1]  && voxel.cell[2] == toRemove.cell[2] ) {
					
					voxelList.splice( c, 1 )
					voxels[ voxel.cell.join(".")] = null
				}

				c--

			}

			p --

		}

	} else if ( message.command == "add entity" ) {

		if (!!! voxels[data.coords.join(".")])

			voxels[data.coords.join(".")] = { entities: [], cell: data.coords }


    	entities = voxels[data.coords.join(".")].entities

    	entities.push( data.entity )

  } else if ( message.command == "remove entity" ) {

    	entities = voxels[ data.coords.join(".") ].entities

		if ( entities != null ) {

			c = entities.length-1

			while ( c >= 0 ) {

				if ( entities[c].id == data.entityId ) {

					voxels[ data.coords.join(".") ].entities.splice(c, 1)
					c = -1

				}

				c--

			}

		}

	} else if ( message.command == "update entity" ) {

		entities = voxels[ data.coords.join(".") ].entities

		if ( entities != null ) {

			c = entities.length-1

			while ( c >= 0 ) {

				if (entities[ c ].id == data.entityId) {

					entities[ c ] = data.entity
					c = -1

				}

				c--

			}

		}

	} else if ( message.command == "clear" ) {

		voxels = []
		voxelList = []

	} else if ( message.command == "start" ) {

		self.update()

	} else if ( message.command == "stop" ) {

		self.stop()

	} else if ( message.command == "log" ) {

		if (data == "") {
			self.postMessage('{"command":"log","data":[' + user.position[0] + ',' + user.position[1] + ',' + user.position[2] + ']}');
			self.postMessage('{"command":"log","data":' + JSON.stringify(voxels)+ '}');
		}

	}
};

self.stop = () => {

	clearTimeout( self.updateLoop )

}
