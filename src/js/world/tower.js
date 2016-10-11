class Tower {
	constructor (data, platform) {
		var f = 0,
				i = 0,
				face = null,
				floors = data.floors,
				// x = data.position[0],
				// z = data.position[2],
				bsp,
				wallBSP,
				height = 20000 * floors,
				width = 50000,
				length = 120000,
				intensity = 0,
				towerMaterial = new THREE.MeshLambertMaterial({
					color: 0xf5f5f5,
					wireframe: false
				}),
				towerGeometry = new THREE.BoxGeometry(50000, height, 10000),
				shaftGeometry = new THREE.BoxGeometry(10000, height, 10000),
				windowGeometry = new THREE.BoxGeometry(width * 0.666, ((height / floors) / 1.25), 2000),
				windowBSP = null,
				windowMesh = null,
				towerMesh,
				finalGeom,
				detailLevels = [],
				floorHeight = 1;

        this.towerMaterial = towerMaterial;
		this.platform = platform;

		towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
		towerMesh.position.set(0, 0, -length / 2);
		towerMesh.updateMatrix();
		bsp = new ThreeBSP(towerMesh);

		towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
		towerMesh.position.set(0, 0, length / 2);
		towerMesh.updateMatrix();
		wallBSP = new ThreeBSP(towerMesh);
		bsp = bsp.union(wallBSP);

		towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
		towerMesh.position.set(-width / 2, 0, 0);
		towerMesh.rotateY(Math.PI / 2);
		towerMesh.updateMatrix();
		wallBSP = new ThreeBSP(towerMesh);
		bsp = bsp.union(wallBSP);

		towerMesh = new THREE.Mesh(towerGeometry, towerMaterial);
		towerMesh.position.set(width / 2, 0, 0);
		towerMesh.rotateY(Math.PI / 2);
		towerMesh.updateMatrix();
		wallBSP = new ThreeBSP(towerMesh);
		bsp = bsp.union(wallBSP);

		for (f = 0; f < floors; f++) {
			floorHeight = 19500 + (-height / 2) + (f * 20000);
			bsp = bsp.union(this.initFloor(floorHeight));
			windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
			windowMesh.position.set(-width / 2, floorHeight - 10000, 0);
			windowMesh.rotateY(Math.PI / 2);
			windowMesh.updateMatrix();
			windowBSP = new ThreeBSP(windowMesh);
			bsp = bsp.subtract(windowBSP);
			windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
			windowMesh.position.set(width / 2, floorHeight - 10000, 0);
			windowMesh.rotateY(Math.PI / 2);
			windowMesh.updateMatrix();
			windowBSP = new ThreeBSP(windowMesh);
			bsp = bsp.subtract(windowBSP);
			windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
			windowMesh.position.set(0, floorHeight - 10000, -width / 2);
			windowMesh.updateMatrix();
			windowBSP = new ThreeBSP(windowMesh);
			bsp = bsp.subtract(windowBSP);
			windowMesh = new THREE.Mesh(windowGeometry, towerMaterial);
			windowMesh.position.set(0, floorHeight - 10000, width / 2);
			windowMesh.updateMatrix();
			windowBSP = new ThreeBSP(windowMesh);
			bsp = bsp.subtract(windowBSP);
		}

		var elevator = new THREE.Mesh(shaftGeometry, towerMaterial);
		elevator.position.set((width / 2) - 5000, 0, (length / 2) - 5000);
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
        this.mesh.position.set(data.position[0]*32000, floors * 10000, data.position[2]*32000);
	}

    initFloor (y) {
    		var floorGeometry = new THREE.BoxGeometry(50000, 500, 50000),
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


}




export default Tower;
