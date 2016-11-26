class Tower {
	constructor (data, platform) {
		var f = 0,
				i = 0,
				face = null,
				floors = data.floors,
				bsp,
				wallBSP,
				height = 50000 * floors,
				xUnits = (data.width || 1),
				zUnits = (data.length || 1),
				width = 50000 * xUnits,
				length = 50000 * zUnits,
				intensity = 0,
				towerMaterial = new THREE.MeshLambertMaterial({
					color: 0xf0f0f0,
					wireframe: false
				}),
				towerGeometry = new THREE.BoxGeometry(50000 * xUnits, height, 5000),
				towerGeometryB = new THREE.BoxGeometry(5000, height, 50000 * zUnits),
				shaftGeometry = new THREE.BoxGeometry(25000 * zUnits, height, 25000 * zUnits),
				windowGeometry = new THREE.BoxGeometry(width * 0.75, 35000, 10000),
				windowBSP = null,
				windowMesh = null,
				towerMesh,
				finalGeom,
				detailLevels = [],
				floorHeight = 1;


    this.towerMaterial = towerMaterial;
		this.platform = platform;
		this.width = width;
		this.length = length;

		towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
		towerMesh.position.set(0, 0, -length / 2);
		towerMesh.updateMatrix();
		bsp = new ThreeBSP(towerMesh);

		towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
		towerMesh.position.set(0, 0, length / 2);
		towerMesh.updateMatrix();
		wallBSP = new ThreeBSP(towerMesh);
		bsp = bsp.union(wallBSP);

		towerMesh = new THREE.Mesh(towerGeometryB, towerMaterial);
		towerMesh.position.set(-width / 2, 0, 0);
		//towerMesh.rotateY(Math.PI / 2);
		towerMesh.updateMatrix();
		wallBSP = new ThreeBSP(towerMesh);
		bsp = bsp.union(wallBSP);

		towerMesh = new THREE.Mesh(towerGeometryB, towerMaterial);
		towerMesh.position.set(width / 2, 0, 0);
		//towerMesh.rotateY(Math.PI / 2);
		towerMesh.updateMatrix();
		wallBSP = new ThreeBSP(towerMesh);
		bsp = bsp.union(wallBSP);

		for (f = 0; f < floors; f++) {
			floorHeight = (-height / 2) + (f * 50000);
			bsp = bsp.union(this.initFloor(floorHeight, xUnits, zUnits));
			if (f > 0) {
				windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
				windowMesh.position.set(-width / 2, floorHeight - 17500, 0);
				windowMesh.rotateY(Math.PI / 2);
				windowMesh.updateMatrix();
				windowBSP = new ThreeBSP(windowMesh);
				bsp = bsp.subtract(windowBSP);
				windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
				windowMesh.position.set(width / 2, floorHeight - 17500, 0);
				windowMesh.rotateY(Math.PI / 2);
				windowMesh.updateMatrix();
				windowBSP = new ThreeBSP(windowMesh);
				bsp = bsp.subtract(windowBSP);
				windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
				windowMesh.position.set(0, floorHeight - 17500, -width / 2);
				windowMesh.updateMatrix();
				windowBSP = new ThreeBSP(windowMesh);
				bsp = bsp.subtract(windowBSP);
				windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
				windowMesh.position.set(0, floorHeight - 17500, width / 2);
				windowMesh.updateMatrix();
				windowBSP = new ThreeBSP(windowMesh);
				bsp = bsp.subtract(windowBSP);
			}
		}

		var elevator = new THREE.Mesh(shaftGeometry, towerMaterial);
		elevator.position.set((width / 2) - 10000, 0, (length / 2) - 10000);
		elevator.rotateY(Math.PI / 2);
		elevator.updateMatrix();
		var elevatorBSP = new ThreeBSP(elevator);
		bsp = bsp.subtract(elevatorBSP);
		//    finalGeom.computeVertexNormals();
		//    finalGeom.computeFaceNormals();
		finalGeom = bsp.toGeometry();
		//	for (i = 0, f = finalGeom.faces.length; i < f; i++) {
		//			face = finalGeom.faces[i];
		//			intensity = 0.10 + Math.pow(Math.random() * 0.3 + 0.3 * Math.abs((((i % 32) - 16)/16) * (Math.floor(i / 32) - 16) / 16), 2);
		//			face.color.setRGB(intensity, intensity, intensity);
		//	}
        this.mesh = new THREE.Mesh(finalGeom, towerMaterial);
        this.platform.mesh.add(this.mesh);
        this.mesh.position.set(data.position[0]*50000, 500+(floors+1) * 25000, data.position[2]*50000);
	}

    initFloor (y, width, length) {
    		var floorGeometry = new THREE.BoxGeometry(50000*width, 1600, 50000*length),
    		    floor = new THREE.Mesh(floorGeometry, this.towerMaterial),
    		    floorBSP;
    		floor.position.set(0, y, 0);
    		floor.updateMatrix();
    		return new ThreeBSP(floor);
	}

    // initBuilding (data) {
    // 		var i = 0,
    // 		    face = null,
    // 		    floors = data.floors,
    // 		    x = data.position[0],
    // 		    z = data.position[2],
    // 		    bsp,
    // 		    wallBSP,
    // 		    height = 2000 * floors,
    // 		    width = 5000,
    // 		    length = 5000,
    // 		    building = null,
    // 		    buildingMaterial = new THREE.MeshLambertMaterial({
    // 			color: 16119285,
    // 			wireframe: false
    // 		}),
    // 		    buildingMesh,
    // 		    finalGeom,
    // 		    detailLevels = [],
    // 		    floorHeight = 1;
    // 		detailLevels.push([new THREE.BoxGeometry(width, height, length), 35000]);
    // 		building = new THREE.LOD();
    // 		for (i = 0; i < detailLevels.length; i++) {
    // 			buildingMesh = new THREE.Mesh(detailLevels[i][0], buildingMaterial);
    // 			buildingMesh.scale.set(1, 1, 1);
    // 			if (i == 1) {
    // 				buildingMesh.position.set(0, 0, -2500);
    // 			}
    // 			buildingMesh.updateMatrix();
    // 			buildingMesh.matrixAutoUpdate = false;
    // 			building.addLevel(buildingMesh, detailLevels[i][1]);
    // 		}
    // 		building.position.set(x, height / 2, z);
    // 		building.updateMatrix();
    // 		building.matrixAutoUpdate = false;
    // 		three.scene.add(building);
    // 		return building;
    // 	}

    initElevator(x, y, z) {

    }

		initLight () {
				let emblem = null,
						geom = new THREE.CylinderGeometry( 132000, 132000, 50000, 6, 1),
						emblemMat = new THREE.MeshBasicMaterial( {color: 0xffffff, fog: false, wireframe: false} );

				emblem = new THREE.Mesh(geom, emblemMat);
				this.mesh.add(emblem);
				emblem.position.set(this.width/2, 64000, this.length/2 );
				emblem.scale.set(0.1, 0.4, 0.1);
				let lightColor = 0x00ff80;
				if (Math.random() < 0.7) {
					if (Math.random() < 0.6) {
						lightColor = 0x30ff00;
					} else {
						if (Math.random() < 0.5) {
							lightColor = 0x00ffff;
						} else {
							if (Math.random() < 0.4) {
								lightColor = 0x00ff00;
							} else {
								lightColor = 0x0080ff;
							}

						}
					}
				}
				let light =  new THREE.PointLight(lightColor, 1.0, 900000);
				emblem.add(light);
		}
}

export default Tower;
